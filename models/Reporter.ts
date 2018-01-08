import * as fs from 'fs';
import { SuiteResults } from './SuiteResults';
import { Options } from './Options';
import { iSpecResults } from '../interfaces/results';
import jasmine from 'jasmine';
import * as _ from 'lodash';
import * as Jimp from 'jimp';

export class Reporter {
	private opts: Options;
	private suites: {[key: string]: jasmine.Suite};
	private specs: {[key: string]: jasmine.Spec};
	private runningSuite: jasmine.Suite;

	constructor(opts: Options) {
		this.opts = opts;
		this.suites = {};
		this.specs = {};
		this.runningSuite = null;
	}

	public getRunningSuite(): jasmine.Suite {
		return this.runningSuite;
	}

	public setRunningSuite(data: jasmine.Suite): void {
		this.runningSuite = data;
	}

	public getSuites(): {[key: string]: jasmine.Suite} {
		return this.suites;
	}

	public getSpecs(): {[key: string]: jasmine.Spec} {
		return this.specs;
	}

	// returns spec clone or creates one
	public getSpecClone(spec: jasmine.Spec): jasmine.Spec {
		this.specs[spec.id] = _.extend((this.specs[spec.id] || {}), spec);
		return this.specs[spec.id];
	}


	// returns suite clone or creates one
	public getSuiteClone(suite: jasmine.Suite): jasmine.Suite {
		this.suites[suite.id] = _.extend((this.suites[suite.id] || {}), suite);
		return this.suites[suite.id];
	}

	// write data into opts.dest as filename
	public writeScreenshot(spec: any, data: any, filename: string): void {
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
	public getDuration(obj): number {
		if (!obj._started || !obj._finished) {
			return 0;
		}
		var duration = (obj._finished - obj._started) / 1000;
		return (duration < 1) ? duration : Math.round(duration);
	}

	public printSpec(spec: any): iSpecResults {
		var suiteName: string = spec._suite ? spec._suite.fullName : '';
		if (spec.isPrinted) {
			return null;
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

	public printResults(suite: any): SuiteResults {
		var output: SuiteResults = new SuiteResults(suite.fullName, this.getDuration(suite));

		_.each(suite._specs, (spec) => {
			spec = this.specs[spec.id];
			output.addSpec(this.printSpec(spec));
			if (spec.status === 'failed') {
				output.incrementSpecsFailed();
			} else {
				output.incrementSpecsPassed();
			}
		});

		if (suite._suites.length > 0) {
			_.each(suite._suites, (childSuite) => {
				output.addChildSuite(this.printResults(childSuite));
			});
		}

		return output;
	}

	public printReasonsForFailure(spec: any): string[] {
		if (spec.status !== 'failed') return null;

		let reasons: string[] = [];

		_.each(spec.failedExpectations, (exp: string): void => {
			reasons.push(exp);
		});

		return reasons;
	}

}
