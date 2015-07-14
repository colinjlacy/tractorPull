/**
 * Created by colinlacy on 3/20/15.
 */

var fs     = require('fs'),
    mkdirp = require('mkdirp'),
    _      = require('lodash'),
    path   = require('path'),
    hat    = require('hat');

require('string.prototype.startswith');

function tractorPull(opts) {
    'use strict';

    var suites       = {},   // suite clones
        specs        = {},   // tes spec clones
        runningSuite = null; // currently running suite

    var pathBuilder = function(spec, suites, capabilities) {
        return hat();
    };

    var metadataBuilder = function(spec, suites, capabilities) {
        return false;
    };

    // write data into opts.dest as filename
    var writeScreenshot = function (data, filename) {
        var stream = fs.createWriteStream(opts.dest + filename);
        stream.write(new Buffer(data, 'base64'));
        stream.end();
    };

    // returns suite clone or creates one
    var getSuiteClone = function(suite) {
        suites[suite.id] = _.extend((suites[suite.id] || {}), suite);
        return suites[suite.id];
    };

    // returns spec clone or creates one
    var getSpecClone = function(spec) {
        specs[spec.id] = _.extend((specs[spec.id] || {}), spec);
        return specs[spec.id];
    };

    // returns duration in seconds
    var getDuration = function(obj) {
        if (!obj._started || !obj._finished) {
            return 0;
        }
        var duration = (obj._finished - obj._started) / 1000;
        return (duration < 1) ? duration : Math.round(duration);
    };

    var isSpecValid = function (spec) {
        // Don't screenshot skipped specs
        var isSkipped = opts.ignoreSkippedSpecs && spec.status === 'pending';
        // Screenshot only for failed specs
        var isIgnored = opts.captureOnlyFailedSpecs && spec.status !== 'failed';

        return !isSkipped && !isIgnored;
    };

    var hasValidSpecs = function (suite) {
        var validSuites = false;
        var validSpecs = false;

        if (suite._suites.length) {
            validSuites = _.any(suite._suites, function(s) {
                return hasValidSpecs(s);
            });
        }

        if (suite._specs.length) {
            validSpecs = _.any(suite._specs, function(s) {
                return isSpecValid(s);
            });
        }

        return validSuites || validSpecs;
    };

    // TODO: more options
    opts          = opts || {};
    opts.dest     = (opts.dest || './results/screenshots') + '/';
    opts.filename = opts.filename || './results/report.html';
    opts.ignoreSkippedSpecs = opts.ignoreSkippedSpecs || false;
    opts.captureOnlyFailedSpecs = opts.captureOnlyFailedSpecs || false;
    opts.pathBuilder = opts.pathBuilder || pathBuilder;
    opts.metadataBuilder = opts.metadataBuilder || metadataBuilder;


    this.jasmineStarted = function() {
        mkdirp(opts.dest, function(err) {
            var files;

            if(err) {
                throw new Error('Could not create directory ' + opts.dest);
            }

            files = fs.readdirSync(opts.dest);

            _.each(files, function(file) {
                var filepath = opts.dest + file;
                if (fs.statSync(filepath).isFile()) {
                    fs.unlinkSync(filepath);
                }
            });
        });
    };

    this.suiteStarted = function(suite) {
        suite = getSuiteClone(suite);
        suite._suites = [];
        suite._specs = [];
        suite._started = Date.now();
        suite._parent = runningSuite;
        suite.isPrinted = false;

        if (runningSuite) {
            runningSuite._suites.push(suite);
        }

        runningSuite = suite;
    };

    this.suiteDone = function(suite) {
        suite = getSuiteClone(suite);
        suite._finished = Date.now();
        runningSuite = suite._parent;
    };

    this.specStarted = function(spec) {
        spec = getSpecClone(spec);
        spec._started = Date.now();
        spec._suite = runningSuite;
        runningSuite._specs.push(spec);
    };

    this.specDone = function(spec) {
        var file;
        spec = getSpecClone(spec);
        spec._finished = Date.now();

        if (!isSpecValid(spec)) {
            spec.isPrinted = true;
            return;
        }

        file = opts.pathBuilder(spec, suites);
        spec.filename = file + '.png';

        browser.takeScreenshot().then(function (png) {
            browser.getCapabilities().then(function (capabilities) {
                var screenshotPath,
                    metadataPath,
                    metadata;

                screenshotPath = path.join(opts.dest, spec.filename);
                metadata       = opts.metadataBuilder(spec, suites, capabilities);

                if (metadata) {
                    metadataPath = path.join(opts.dest, file + '.json');
                    mkdirp(path.dirname(metadataPath), function(err) {
                        if(err) {
                            throw new Error('Could not create directory for ' + metadataPath);
                        }
                        writeMetadata(metadata, metadataPath);
                    });
                }

                mkdirp(path.dirname(screenshotPath), function(err) {
                    if(err) {
                        throw new Error('Could not create directory for ' + screenshotPath);
                    }
                    writeScreenshot(png, spec.filename);
                });
            });
        });
    };

    this.jasmineDone = function() {
        var output = {};
        output.suites = [];
        output.specs = 0;
        output.specsPassed = 0;
        output.specsFailed = 0;

        _.each(suites, function(suite) {
            var suiteResults = printResults(suite);
            output.suites.push(suiteResults);
            output.specs += suite._specs.length;
            output.specsPassed += suiteResults.specsPassed;
            output.specsFailed += suiteResults.specsFailed;
            suite.isPrinted = true;
        });

        // Ideally this shouldn't happen, but some versions of jasmine will allow it
        //_.each(specs, function(spec) {
        //    output.specs.push(printSpec(spec));
        //});

        fs.writeFileSync(opts.filename, templateBuilder(output), {encoding: 'utf8'}, function(err){
            if(err){
                console.error('Error writing to file:' + opts.dest + opts.filename);
                throw err;
            }
        });
    };

    // TODO: better template

    function printSpec(spec) {
        var suiteName = spec._suite ? spec._suite.fullName : '';
        if (spec.isPrinted) {
            return;
        }

        spec.isPrinted = true;

        var specData = {
            status: spec.status,
            link: "./screenshots/" + spec.filename,
            fullname: spec.fullname,
            shortname: spec.fullName.replace(suiteName, '').trim(),
            duration: getDuration(spec),
            failure: printReasonsForFailure(spec)
        };

        return specData;
    }

    // TODO: proper nesting -> no need for magic
    function printResults(suite) {
        var output = {};

        if (suite.isPrinted || !hasValidSpecs(suite)) {
            return;
        }

        suite.isPrinted = true;

        output.suiteFullName = suite.fullName;
        output.suiteDuration = getDuration(suite);
        output.specs = [];
        output.specsPassed = 0;
        output.specsFailed = 0;

        _.each(suite._specs, function(spec) {
            spec = specs[spec.id];
            output.specs.push(printSpec(spec));
            if (spec.status === 'failed') {
                output.specsFailed++;
            } else {
                output.specsPassed++;
            }
        });

        if (suite._suites.length > 0) {
            output.chilSuites = [];
            _.each(suite._suites, function(childSuite) {
                output.chilSuites.push(printResults(childSuite));
            });
        }

        return output;
    }

    function printReasonsForFailure(spec) {
        if (spec.status !== 'failed') {
            return;
        }

        var reasons = [];
        _.each(spec.failedExpectations, function(exp) {
            reasons.push(exp);
        });

        return reasons;
    }

    return this;
}

function templateBuilder(dataObj) {
    var testResults = function(data) {
        var tpl = "";
        // loop through the suites
        for (var suite = 0; suite < data.suites.length; suite++) {
            tpl += '<h3>' + data.suites[suite].suiteFullName + '<small> | Duration: ' + data.suites[suite].suiteDuration + ' seconds</small></h3>' +
            '<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
            // loop through the specs
            for (var spec = 0; spec < data.suites[suite].specs.length; spec++) {
                // sets the background for the panels
                var bg = data.suites[suite].specs[spec].status === "passed" ? "success" : "danger";
                // continues building out the template
                tpl += '<div class="panel panel-' + bg + '">' +
                '<div class="panel-heading" role="tab" id="heading' + suite + "--" +spec + '">' +
                '<h4 class="panel-title">' +
                '<a data-toggle="collapse" data.suites-parent="#accordion" href="#collapse' + suite + "--" +spec + '" aria-expanded="true" aria-controls="collapseOne">' +
                data.suites[suite].specs[spec].shortname +
                '</a>' +
                '</h4>' +
                '</div>' +
                '<div id="collapse' + suite + "--" +spec + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">' +
                '<div class="panel-body">';
                // pass a simple message if it passed
                if (data.suites[suite].specs[spec].status === 'passed') {
                    tpl += '<p><strong>Duration: </strong>' + data.suites[suite].specs[spec].duration + ' seconds, <a href="' + data.suites[suite].specs[spec].link + '"><span class="fa fa-picture-o"></span> View Screenshot</a></p>';
                } else { // pass a list of reasons for failures if it fails
                    tpl += '<p><strong>Duration: </strong>' + data.suites[suite].specs[spec].duration + ' seconds</p>';
                    for (var fail = 0; fail < data.suites[suite].specs[spec].failure.length; fail++) {
                        tpl += '<p><strong>Message: </strong>' + data.suites[suite].specs[spec].failure[fail].message + '</p>' +
                        '<p><strong>Stack Trace:</strong></p>' +
                        '<p><small>' + data.suites[suite].specs[spec].failure[fail].stack + '</small></p>';
                    }
                    tpl += '<a href="' + data.suites[suite].specs[spec].link + '"><span class="fa fa-picture-o"></span> View Screenshot</a>' +
                    '</p>';
                }


                tpl += '</div>' +
                '</div>' +
                '</div>'
            }

            tpl += '</div>' +
            '<hr/>';

        }

        return tpl;

    };

    var report = testResults(dataObj);

    var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

    var uglyDate = new Date(),
        hours = uglyDate.getHours() < 13 ? uglyDate.getHours() : uglyDate.getHours() - 12,
        minutes = uglyDate.getMinutes() > 9 ? uglyDate.getMinutes() : "0" + uglyDate.getMinutes(),
        am_pm = uglyDate.getHours() < 13 ? "am" : "pm",
        date = monthNames[uglyDate.getMonth()] + " " + uglyDate.getDate() + ", " + uglyDate.getFullYear() + " - " + hours + ":" + minutes + am_pm;

    var head = '<!DOCTYPE html>' +
        '<head>' +
        '<title>' + date + '</title>' +
        '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">' +
        '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap-theme.min.css">' +
        '<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">' +
        '<style> .spec-passed { background-color: #dff0d8; } .spec-failed { background-color: #f2dede; } </style>' +
        '</head>' +
        '<body>';

    var body = '<div class="container"><div class="row">' +
        '<div class="col-sm-12">' +
        '<h1>Report: ' + date + '</h1>' +
        '<hr/>' +
        '<h2>Test Suites Run: ' + dataObj.suites.length + '</h2>' +
        '<hr/>' +
        '<div class="row">' +
        '<div class="col-sm-4">' +
        '<h3 class="text-muted"><span class="fa fa-exclamation-circle"></span> Total Specs Run: ' + dataObj.specs + '</h3>' +
        '</div>' +
        '<div class="col-sm-4">' +
        '<h3 class="text-muted"><span class="fa fa-check-circle text-success"></span> Specs Passed: ' + dataObj.specsPassed + '</h3>' +
        '</div>' +
        '<div class="col-sm-4">' +
        '<h3 class="text-muted"><span class="fa fa-times-circle text-danger"></span> Specs Failed: ' + dataObj.specsFailed + '</h3>' +
        '</div>' +
        '</div>' +
        '<hr/>';

    body += report;

    body +='</div>' +
    '</div>' +
    '</div>';

    var end = '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>' +
        '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>' +
        '</body>' +
        '</html>';

    return head + body + end;
}


module.exports = tractorPull;