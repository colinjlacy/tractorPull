
var fs                      = require('fs'),
	_                       = require('lodash'),
	jimp                    = require('jimp');

class Reporter {

	constructor(opts) {
		this._opts = opts;
		this._suites = {};
		this._specs = {};
		this._runningSuite = null;
	}

	get runningSuite() {
		return this._runningSuite;
	}

	set runningSuite(data) {
		this._runningSuite = data;
	}

	get suites() {
		return this._suites;
	}

	set suites(data) {
		this._suites = data;
	}

	get specs() {
		return this._specs;
	}

	set specs(data) {
		this._specs = data;
	}

	// returns spec clone or creates one
	getSpecClone(spec) {
		this._specs[spec.id] = _.extend((this.specs[spec.id] || {}), spec);
		return this._specs[spec.id];
	};


	// returns suite clone or creates one
	getSuiteClone(suite) {
		this._suites[suite.id] = _.extend((this._suites[suite.id] || {}), suite);
		return this._suites[suite.id];
	}

	// write data into opts.dest as filename
	writeScreenshot(spec, data, filename) {
		let imageBuffer = new Buffer(data, 'base64');
		if(spec.element) {
			jimp.read(imageBuffer).then((image /* Jimp */ ) => {
				image.crop(spec.element.left, spec.element.top, spec.element.width, spec.element.height);
				image.write(this._opts.dest + filename);
			});
		} else {
			var stream = fs.createWriteStream(this._opts.dest + filename);
			stream.write(imageBuffer);
			stream.end();
		}
	}

	// returns duration in seconds
	getDuration(obj) {
		if (!obj._started || !obj._finished) {
			return 0;
		}
		var duration = (obj._finished - obj._started) / 1000;
		return (duration < 1) ? duration : Math.round(duration);
	}

	printSpec(spec) {
		var suiteName = spec._suite ? spec._suite.fullName : '';
		if (spec.isPrinted) {
			return;
		}

		spec.isPrinted = true;

		return {
			status: spec.status,
			link: "./screenshots/" + spec.filename,
			fullname: spec.fullname,
			shortname: spec.fullName.replace(suiteName, '').trim(),
			duration: this.getDuration(spec),
			failure: this.printReasonsForFailure(spec)
		};
	}

	printResults(suite) {
		var output = {};

		output.suiteFullName = suite.fullName;
		output.suiteDuration = this.getDuration(suite);
		output.specs = [];
		output.specsPassed = 0;
		output.specsFailed = 0;

		_.each(suite._specs, (spec) => {
			spec = this._specs[spec.id];
			output.specs.push(this.printSpec(spec));
			if (spec.status === 'failed') {
				output.specsFailed++;
			} else {
				output.specsPassed++;
			}
		});

		if (suite._suites.length > 0) {
			output.chilSuites = [];
			_.each(suite._suites, (childSuite) => {
				output.chilSuites.push(this.printResults(childSuite));
			});
		}

		return output;
	}

	printReasonsForFailure(spec) {
		if (spec.status !== 'failed') {
			return;
		}

		var reasons = [];
		_.each(spec.failedExpectations, function(exp) {
			reasons.push(exp);
		});

		return reasons;
	}

}

module.exports = Reporter;