import * as fs from 'fs';
import { SuiteResults } from './SuiteResults';
import { SpecResults } from './SpecResults';
import { Options } from './Options';
import { ExtendedSuite } from './ExtendedSuite';
import { ExtendedSpec } from './ExtendedSpec';
import { iSpecResults } from '../interfaces/results';
import * as _ from 'lodash';
import * as Jimp from 'jimp';
const jasmine = require('jasmine');

export class Reporter {
	private opts: Options;
	private suites: {[key: string]: ExtendedSuite}; // values will only ever be the extended suite object
	private specs: {[key: string]: ExtendedSpec};
	private runningSuite: ExtendedSuite; // will actually hold the extended suite object

	constructor(opts: Options) {
		this.opts = opts;
		this.suites = {};
		this.specs = {};
		this.runningSuite = null;
	}

	public getRunningSuite(): ExtendedSuite {
		return this.runningSuite;
	}

	public setRunningSuite(data: ExtendedSuite): void {
		this.runningSuite = data;
	}

	public getSuites(): {[key: string]: ExtendedSuite} {
		return this.suites;
	}

	public getSpecs(): {[key: string]: ExtendedSpec} {
		return this.specs;
	}

	// creates spec clone
	public setSpecClone(spec: jasmine.Spec, suite: ExtendedSuite): ExtendedSpec {
		this.specs[spec.id] = new ExtendedSpec(spec, suite);
		return this.specs[spec.id];
	}

	// returns spec clone
	public getSpecClone(spec: jasmine.Spec): ExtendedSpec {
		this.specs[spec.id] = Object.assign({}, this.specs[spec.id], spec);
		return this.specs[spec.id];
	}

	// creates suite clone
	public setSuiteClone(suite: jasmine.Suite): ExtendedSuite {
		this.suites[suite.id] = new ExtendedSuite(suite);
		return this.suites[suite.id];
	}

	// returns suite clone
	public getSuiteClone(suite: jasmine.Suite): ExtendedSuite {
		this.suites[suite.id] = Object.assign({}, this.suites[suite.id], suite);
		return this.suites[suite.id];
	}

	// write data into opts.dest as filename
	public writeScreenshot(spec: ExtendedSpec, data: any, filename: string): void {
		let imageBuffer = new Buffer(data, 'base64');
		if(!!spec.element) {
			Jimp.read(imageBuffer).then((image: Jimp.Jimp) => {
				image.crop(spec.element.left, spec.element.top, spec.element.width, spec.element.height);
				image.write(this.opts.getDest() + filename);
			});
		} else {
			var stream = fs.createWriteStream(this.opts.getDest() + filename);
			stream.write(imageBuffer);
			stream.end();
		}
	}

	// returns duration in seconds
	public getDuration(obj: ExtendedSpec | ExtendedSuite): number {
		if (!obj.started || !obj.finished) {
			return 0;
		}
		var duration = (obj.finished - obj.started) / 1000;
		return (duration < 1) ? duration : Math.round(duration);
	}

	public printSpec(spec: ExtendedSpec): SpecResults {
		if (spec.isPrinted) {
			return null;
		}

		spec.isPrinted = true;

		return new SpecResults(spec, this.getDuration(spec), this.printReasonsForFailure(spec));
	}

	public printResults(suite: ExtendedSuite): SuiteResults {
		var output: SuiteResults = new SuiteResults(suite.fullName, this.getDuration(suite));

		suite._specs.forEach((specOrig: ExtendedSpec) => {
			const spec: ExtendedSpec = this.specs[specOrig.id];
			output.addSpec(this.printSpec(spec));
			if (spec.status === 'failed') {
				output.incrementSpecsFailed();
			} else {
				output.incrementSpecsPassed();
			}
		});

		if (suite._suites.length > 0) {
			suite._suites.forEach((childSuite: ExtendedSuite) => {
				output.addChildSuite(this.printResults(childSuite));
			});
		}

		return output;
	}

	public printReasonsForFailure(spec: ExtendedSpec): {message: string, stack: any}[] {
		if (spec.status !== 'failed') return null;

		let reasons: {message: string, stack: any}[] = [];

		spec.failedExpectations.forEach((exp: {message: string, stack: any}): void => {
			reasons.push(exp);
		});

		return reasons;
	}

}
