
import { Reporter } from './models/Reporter';
import { TestResults } from './models/TestResults';
import { SuiteResults } from './models/SuiteResults';
import { FormattedDate } from './models/FormattedDate';
import { TemplateBuilder } from './models/TemplateBuilder';
import { ExtendedSuite } from './models/ExtendedSuite';
import { ExtendedSpec } from './models/ExtendedSpec';
import { Options } from './models/Options';
import { Validator } from './models/Validator';
import { iOptions } from './interfaces/options';
import { browser, by, element } from 'protractor';
import * as _ from 'lodash';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
const jasmine = require('jasmine');

export class TractorPull {

	public jasmineStarted: Function;
	public suiteStarted: Function;
	public suiteDone: Function;
	public specStarted: Function;
	public specDone: Function;
	public jasmineDone: Function;

	constructor(initialOptions: iOptions) {
		const opts: Options = new Options(initialOptions);
		const reporter: Reporter = new Reporter(opts);
		const validator = new Validator(opts);

		this.jasmineStarted = function(): void {
			mkdirp(opts.getDest(), function(err): void {
				var files;

				if(err) {
					throw new Error('Could not create directory ' + opts.getDest());
				}

				files = fs.readdirSync(opts.getDest());

				files.forEach((file) => {
					var filepath = opts.getDest() + file;
					if (fs.statSync(filepath).isFile()) {
						fs.unlinkSync(filepath);
					}
				});
			});
		};

		this.suiteStarted = function(suiteOrig: jasmine.Suite): void {
			const runningSuite: ExtendedSuite = reporter.getRunningSuite();
			const suite: ExtendedSuite = reporter.setSuiteClone(suiteOrig);

			if (runningSuite) {
				reporter.setRunningSuite(runningSuite);
			}

			reporter.setRunningSuite(suite);
		};

		this.suiteDone = function(suiteOrig: jasmine.Suite): void {
			const suite = reporter.getSuiteClone(suiteOrig);
			suite.setFinished(Date.now());
			reporter.setRunningSuite(suite.getParent());
		};

		this.specStarted = function(specOrig: jasmine.Spec): void {
			const runningSuite = reporter.getRunningSuite();
			const spec = reporter.setSpecClone(specOrig, runningSuite);
			runningSuite.setSpecs([...runningSuite.getSpecs(), spec]);
			reporter.setRunningSuite(runningSuite);
		};

		this.specDone = function(specOrig: jasmine.Spec): void {
			const spec: any = reporter.getSpecClone(specOrig);
			spec.finished = Date.now();

			if (!validator.isSpecValid(spec)) {
				spec.printed = true;
				return;
			}

			browser.takeScreenshot().then((png) => {
				reporter.writeScreenshot(spec, png, spec.filename);
			});
		};

		this.jasmineDone = function(): void {
			var output: TestResults = new TestResults();

			const suites = reporter.getSuites();


			(<any>Object).values(suites).forEach((suite: ExtendedSuite) => {
				if (!validator.hasValidSpecs(suite)) {
					return;
				}
				console.log(suite);
				var suiteResults: SuiteResults = reporter.printResults(suite);
				output.addSuite(suiteResults);
			});

			const formattedDate: FormattedDate = new FormattedDate();
			const report = new TemplateBuilder(formattedDate.getDate(), output.print()).getTemplate();

			fs.writeFile(opts.getFilename(), report, {encoding: 'utf8'}, (err) => {
				if(err){
					console.error('Error writing to file:' + opts.getDest() + opts.getFilename());
					throw err;
				}
			});

			browser.driver.sleep(1500);
		};

	}
}