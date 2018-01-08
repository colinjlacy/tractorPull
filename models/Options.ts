import { iOptions } from '../interfaces/options';

export class Options {

	private dest: string;
	private filename: string;
	private ignoreSkippedSpecs: boolean;
	private captureOnlyFailedSpecs: boolean;

	constructor(init: iOptions) {
		this.dest                       = init.dest || './results/screenshots';
		this.filename                   = init.filename || './results/report.html';
		this.ignoreSkippedSpecs         = init.ignoreSkippedSpecs || false;
		this.captureOnlyFailedSpecs     = init.captureOnlyFailedSpecs || false;
	}

	public getDest(): string {
		return this.dest;
	}

	public getFilename(): string {
		return this.filename;
	}

	public isIgnoreSkippedSpecs(): boolean {
		return this.ignoreSkippedSpecs;
	}

	public isCaptureOnlyFailedSpecs(): boolean {
		return this.captureOnlyFailedSpecs;
	}
}