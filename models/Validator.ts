import { Options } from './Options';
import { ExtendedSuite } from './ExtendedSuite';
import { ExtendedSpec } from './ExtendedSpec';
import * as _ from 'lodash';
const jasmine = require('jasmine');

export class Validator {

	private opts: Options;

	constructor(opts: Options) {
		this.opts = opts;
	}

	isSpecValid(spec: ExtendedSpec) {
		// Don't screenshot skipped specs
		var isSkipped = this.opts.isIgnoreSkippedSpecs() && spec.status === 'pending';
		// Screenshot only for failed specs
		var isIgnored = this.opts.isCaptureOnlyFailedSpecs() && spec.status !== 'failed';

		return !isSkipped && !isIgnored;
	}

	hasValidSpecs(suite: ExtendedSuite): boolean {
		let validSuites: boolean = false;
		let validSpecs: boolean = false;

		if (suite.suites.length) {
			validSuites = suite.suites.some((s: ExtendedSuite): boolean => this.hasValidSpecs(s));
		}

		if (suite.specs.length) {
			validSpecs = suite.specs.some((s: ExtendedSpec): boolean => this.isSpecValid(s));
		}

		return !!validSuites || !!validSpecs;
	}
}
