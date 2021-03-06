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
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
const jasmine = require('jasmine');

let width: number;
let height: number;

export class Graver {

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

		this.deleteFolderRecursive(opts.getImagePath());

		this.jasmineStarted = (): void => {

			browser.executeScript('return screen').then((screen: any) =>{
				width = screen.availWidth;
				height = screen.availHeight;
				browser.driver.manage().window().setSize(width, height);
			});

			mkdirp(opts.getImagePath(), (err): void => {
				if(err) {
					throw new Error('Could not create directory ' + opts.getImagePath());
				}
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
			const suite: ExtendedSuite = reporter.getSuiteClone(suiteOrig);
			suite.setFinished(Date.now());
			reporter.setRunningSuite(suite.getParent());
		};

		this.specStarted = function(specOrig: jasmine.Spec): void {
			const runningSuite = reporter.getRunningSuite();
			const spec: ExtendedSpec = reporter.setSpecClone(specOrig, runningSuite);
			runningSuite.setSpecs([...runningSuite.getSpecs(), spec]);
			reporter.setRunningSuite(runningSuite);
		};

		this.specDone = function(specOrig: jasmine.Spec): void {
			const spec: ExtendedSpec = reporter.getSpecClone(specOrig);
			spec.setFinished(Date.now());

			browser.takeScreenshot().then((png) => {
				reporter.writeScreenshot(spec, png, spec.getFilename(), width, height);
			});
		};

		this.jasmineDone = function(): void {
			var output: TestResults = new TestResults();

			const suites = reporter.getSuites();


			(<any>Object).values(suites).forEach((suite: ExtendedSuite) => {
				var suiteResults: SuiteResults = reporter.printResults(suite);
				output.addSuite(suiteResults);
			});

			const formattedDate: FormattedDate = new FormattedDate();
			let report;

			if(opts.getFileType().includes('html')) {
				report = new TemplateBuilder(formattedDate.getDate(), output.print(), opts).getTemplate();
			} else {
				report = JSON.stringify(output.print());
			}

			fs.writeFile(opts.getFileName(), report, {encoding: 'utf8'}, (err) => {
				if(err){
					console.error('Error writing to file:' + opts.getImagePath() + opts.getFileName());
					throw err;
				}
			});

			browser.driver.sleep(1500);
		};

	}

	private deleteFolderRecursive(path: string) {
		if (fs.existsSync(path)) {
			fs.readdirSync(path).forEach((file) => {
				const curPath: string = path + "/" + file;
				if (fs.lstatSync(curPath).isDirectory()) {
					this.deleteFolderRecursive(curPath);
				} else { // delete file
					fs.unlinkSync(curPath);
				}
			});
			fs.rmdirSync(path);
		}
	}
}

