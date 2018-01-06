const _ = require('lodash');


class Validator {

	constructor(opts) {
		this.opts = opts;
	}

	isSpecValid(spec) {
		// Don't screenshot skipped specs
		var isSkipped = this.opts.ignoreSkippedSpecs && spec.status === 'pending';
		// Screenshot only for failed specs
		var isIgnored = this.opts.captureOnlyFailedSpecs && spec.status !== 'failed';

		return !isSkipped && !isIgnored;
	}

	hasValidSpecs(suite) {
		var validSuites = false;
		var validSpecs = false;

		if (suite._suites.length) {
			validSuites = _.any(suite._suites, (s) => this.hasValidSpecs(s));
		}

		if (suite._specs.length) {
			validSpecs = _.any(suite._specs, (s) => this.isSpecValid(s));
		}

		return validSuites || validSpecs;
	}
}

module.exports = Validator;