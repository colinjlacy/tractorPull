import * as fs from 'fs';
import { SuiteResults } from './SuiteResults';
import { SpecResults } from './SpecResults';
import { Options } from './Options';
import { ExtendedSuite } from './ExtendedSuite';
import { ExtendedSpec } from './ExtendedSpec';
import { Validator } from './Validator';
import { ElementLocation } from './ElementLocation';
import { iSpecResults } from '../interfaces/results';
import * as _ from 'lodash';
import * as Jimp from 'jimp';
const jasmine = require('jasmine');

export class Reporter {
	private opts: Options;
	private suites: {[key: string]: ExtendedSuite}; // values will only ever be the extended suite object
	private specs: {[key: string]: ExtendedSpec};
	private runningSuite: ExtendedSuite; // will actually hold the extended suite object
	private validator: Validator;

	constructor(opts: Options) {
		this.opts = opts;
		this.suites = {};
		this.specs = {};
		this.runningSuite = null;
		this.validator = new Validator(opts);
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
		this.specs[spec.id].extend(spec);
		return this.specs[spec.id];
	}

	// creates suite clone
	public setSuiteClone(suite: jasmine.Suite): ExtendedSuite {
		this.suites[suite.id] = new ExtendedSuite(suite);
		return this.suites[suite.id];
	}

	// returns suite clone
	public getSuiteClone(suite: jasmine.Suite): ExtendedSuite {
		return this.suites[suite.id];
	}

	// write data into opts.dest as filename
	public writeScreenshot(spec: ExtendedSpec, data: any, filename: string, width?: number, height?: number): void {
		let imageBuffer = new Buffer(data, 'base64');
		if(!!spec.getElement()) {
			Jimp.read(imageBuffer).then((image: Jimp.Jimp) => {
				if(width && height) image.scaleToFit(width, height);
				const element = spec.getElement();
				const elementLocation: ElementLocation = this.validator.stayWithinBounds(width, height, element);
				image.crop(elementLocation.getLeft(), elementLocation.getTop(), elementLocation.getWidth(), elementLocation.getHeight());
				const clone = image.clone();
				clone.cover(100, 100);
				image.write(this.opts.getDest() + filename);
				clone.write(this.opts.getDest() + 'thumbs/' + filename);
			});
		} else {
			Jimp.read(imageBuffer).then((image: Jimp.Jimp) => {
				image.cover(100, 100);
				image.write(this.opts.getDest() + 'thumbs/' + filename);
				const stream = fs.createWriteStream(this.opts.getDest() + filename);
				stream.write(imageBuffer);
				stream.end();
			});
		}
	}

	// returns duration in seconds
	public getDuration(obj: ExtendedSpec | ExtendedSuite): number {
		const started = obj.getStarted();
		const finished = obj.getFinished();
		if (!started || !finished) {
			return 0;
		}
		var duration = (finished - started) / 1000;
		return (duration < 1) ? duration : Math.round(duration);
	}

	public printResults(suite: ExtendedSuite): SuiteResults {
		var output: SuiteResults = new SuiteResults(suite.getFullName(), this.getDuration(suite));
		const specs = suite.getSpecs();

		specs.forEach((specOrig: any) => {
			const spec: ExtendedSpec = this.specs[specOrig.id];
			output.addSpec(new SpecResults(spec, this.getDuration(spec), spec.getFailedExpectations()));
			if (spec.getStatus() === 'failed') {
				output.incrementSpecsFailed();
			} else {
				output.incrementSpecsPassed();
			}
		});

		if (suite.getSuites().length > 0) {
			suite.getSuites().forEach((childSuite: ExtendedSuite) => {
				output.addChildSuite(this.printResults(childSuite));
			});
		}

		return output;
	}
}
