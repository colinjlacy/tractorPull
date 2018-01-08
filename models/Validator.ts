import { Options } from './Options';
import * as _ from 'lodash';
import jasmine from 'jasmine';

export class Validator {

	private opts: Options;

	constructor(opts: Options) {
		this.opts = opts;
	}

	isSpecValid(spec: any) {
		// Don't screenshot skipped specs
		var isSkipped = this.opts.isIgnoreSkippedSpecs() && spec.status === 'pending';
		// Screenshot only for failed specs
		var isIgnored = this.opts.isCaptureOnlyFailedSpecs() && spec.status !== 'failed';

		return !isSkipped && !isIgnored;
	}

	hasValidSpecs(suite): boolean {
		let validSuites: boolean = false;
		let validSpecs: boolean = false;

		if (suite._suites.length) {
			validSuites = suite._suites.some((s: jasmine.Suite): boolean => this.hasValidSpecs(s));
		}

		if (suite._specs.length) {
			validSpecs = suite._specs.some((s: jasmine.Spec): boolean => this.isSpecValid(s));
		}

		return !!validSuites || !!validSpecs;
	}
}
