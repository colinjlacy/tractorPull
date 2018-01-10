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
	public writeScreenshot(spec: any, data: any, filename: string): void {
		let imageBuffer = new Buffer(data, 'base64');
		if(!!spec.getElement) {
			Jimp.read(imageBuffer).then((image: Jimp.Jimp) => {
				const element = spec.element;
				image.crop(element.left, element.top, element.width, element.height);
				image.write(this.opts.getDest() + filename);
			});
		} else {
			var stream = fs.createWriteStream(this.opts.getDest() + filename);
			stream.write(imageBuffer);
			stream.end();
		}
	}

	// returns duration in seconds
	public getDuration(obj: any): number {
		const started = obj.started;
		const finished = obj.finished;
		if (!started || !finished) {
			return 0;
		}
		var duration = (finished - started) / 1000;
		return (duration < 1) ? duration : Math.round(duration);
	}

	public printSpec(spec: any): SpecResults {
		if (spec.printed) {
			return null;
		}

		spec.printed = true;

		return new SpecResults(spec, this.getDuration(spec), this.printReasonsForFailure(spec));
	}

	public printResults(suite: any): SuiteResults {
		var output: SuiteResults = new SuiteResults(suite.fullName, this.getDuration(suite));

		const specs = suite.specs;

		specs.forEach((specOrig: any) => {
			const spec: any = this.specs[specOrig.id];
			output.addSpec(this.printSpec(spec));
			if (spec.status === 'failed') {
				output.incrementSpecsFailed();
			} else {
				output.incrementSpecsPassed();
			}
		});

		if (suite.suites.length > 0) {
			suite.suites.forEach((childSuite: ExtendedSuite) => {
				output.addChildSuite(this.printResults(childSuite));
			});
		}

		return output;
	}

	public printReasonsForFailure(spec: any): {message: string, stack: any}[] {
		if (spec.status !== 'failed') return null;

		let reasons: {message: string, stack: any}[] = [];

		spec.failedExpectations.forEach((exp: {message: string, stack: any}): void => {
			reasons.push(exp);
		});

		return reasons;
	}

}
