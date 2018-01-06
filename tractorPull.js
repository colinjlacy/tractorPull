/**
 * Created by colinlacy on 3/20/15.
 */

const fs                    = require('fs'),
    mkdirp                  = require('mkdirp'),
    _                       = require('lodash'),
    path                    = require('path'),
	hat                     = require('hat'),
	Reporter                = require('./models/Reporter'),
	Validator               = require('./models/Validator'),
	TemplateBuilder         = require('./models/TemplateBuilder'),
	FormattedDate           = require('./models/FormattedDate');

function tractorPull(opts) {

    // TODO: more options
    opts                            = opts || {};
    opts.dest                       = (opts.dest || './results/screenshots') + '/';
    opts.filename                   = opts.filename || './results/report.html';
    opts.ignoreSkippedSpecs         = opts.ignoreSkippedSpecs || false;
    opts.captureOnlyFailedSpecs     = opts.captureOnlyFailedSpecs || false;

	const reporter = new Reporter(opts);
	const validator = new Validator(opts);

	this.jasmineStarted = function() {
        mkdirp(opts.dest, function(err) {
            var files;

            if(err) {
                throw new Error('Could not create directory ' + opts.dest);
            }

            files = fs.readdirSync(opts.dest);

            files.forEach((file) => {
                var filepath = opts.dest + file;
                if (fs.statSync(filepath).isFile()) {
                    fs.unlinkSync(filepath);
                }
            });
        });
    };

    this.suiteStarted = function(suite) {
	    suite = reporter.getSuiteClone(suite);
	    suite._suites = [];
        suite._specs = [];
        suite._started = Date.now();
        suite._parent = reporter.runningSuite;
        suite.isPrinted = false;

	    let runningSuite = reporter.runningSuite;

	    if (runningSuite) {
	        runningSuite._suites.push(suite);
	        reporter.runningSuite = runningSuite;
        }

        reporter.runningSuite = suite;
    };

    this.suiteDone = function(suite) {
	    suite = reporter.getSuiteClone(suite);
	    suite._finished = Date.now();
        reporter.runningSuite = suite._parent;
    };

    this.specStarted = function(spec) {
	    spec = reporter.getSpecClone(spec);
        spec._started = Date.now();
        spec._suite = reporter.runningSuite;
	    const runningSuite = reporter.runningSuite;
	    runningSuite._specs.push(spec);
	    reporter.runningSuite = runningSuite;
    };

    this.specDone = function(spec) {
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

    this.jasmineDone = function() {
        var output = {
	        suites: [],
	        spects: 0,
	        specsPassed: 0,
	        specsFailed: 0
        };

        reporter.suites.forEach((suite) => {
	        if (suite.isPrinted || !validator.hasValidSpecs(suite)) {
		        return;
	        }
	        var suiteResults = reporter.printResults(suite);
            output.suites.push(suiteResults);
            output.specs += suite._specs.length;
            output.specsPassed += suiteResults.specsPassed;
            output.specsFailed += suiteResults.specsFailed;
            suite.isPrinted = true;
        });

	    const formattedDate = new FormattedDate().date;
	    const report = new TemplateBuilder(formattedDate, output).template;

        fs.writeFile(opts.filename, report, {encoding: 'utf8'}, (err) => {
            if(err){
                console.error('Error writing to file:' + opts.dest + opts.filename);
                throw err;
            }
        });

	    browser.driver.sleep(1500);
    };

    return this;
}

module.exports = tractorPull;
