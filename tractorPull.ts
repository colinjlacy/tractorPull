
import { Reporter } from './models/Reporter';
import { TestResults } from './models/TestResults';
import { SuiteResults } from './models/SuiteResults';
import { FormattedDate } from './models/FormattedDate';
import { TemplateBuilder } from './models/TemplateBuilder';
import { Options } from './models/Options';
import { Validator } from './models/Validator';
import { iOptions } from './interfaces/options';
import { browser, by, element } from 'protractor';
import * as _ from 'lodash';
import fs from 'fs';
import jasmine from 'jasmine';
import mkdirp from 'mkdirp';
const hat = require('hat');

export function tractorPull(initialOptions: iOptions): jasmine.CustomReporter  {

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

    this.suiteStarted = function(suite): void {
	    suite = reporter.getSuiteClone(suite);
	    suite.suites = [];
        suite.specs = [];
        suite._started = Date.now();
        suite._parent = reporter.getRunningSuite();
        suite.isPrinted = false;

	    let runningSuite = reporter.getRunningSuite();

	    if (runningSuite) {
	        runningSuite.suites().push(suite);
	        reporter.setRunningSuite(runningSuite);
        }

        reporter.setRunningSuite(runningSuite);
    };

    this.suiteDone = function(suite): void {
	    suite = reporter.getSuiteClone(suite);
	    suite._finished = Date.now();
        reporter.setRunningSuite(suite._parent);
    };

    this.specStarted = function(spec): void {
	    spec = reporter.getSpecClone(spec);
        spec._started = Date.now();
        spec._suite = reporter.getRunningSuite();
	    const runningSuite = reporter.getRunningSuite();
	    runningSuite.specs().push(spec);
	    reporter.setRunningSuite(runningSuite);
    };

    this.specDone = function(spec): void {
	    spec = reporter.getSpecClone(spec);
        spec._finished = Date.now();

        if (!validator.isSpecValid(spec)) {
            spec.isPrinted = true;
            return;
        }

        spec.filename = hat() + '.png';

        browser.takeScreenshot().then((png) => {
            reporter.writeScreenshot(spec, png, spec.filename);
        });
    };

    this.jasmineDone = function(): void {
        var output: TestResults = new TestResults();

	    const suites = reporter.getSuites();

		(<any>Object).values(suites).forEach((suite: jasmine.Suite) => {
	        if (!validator.hasValidSpecs(suite)) {
		        return;
	        }
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

    return this;
}