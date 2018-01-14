import { iOptions } from '../interfaces/options';

export class Options {

	private dest: string;
	private filename: string;
	private ignoreSkippedSpecs: boolean;
	private captureOnlyFailedSpecs: boolean;
	private fileType: string;

	constructor(init: iOptions) {
		this.dest                       = init.dest || './results/screenshots/';
		this.fileType					= '.' + init.fileType || '.html';
		this.filename                   = init.filename || './results/report' + this.fileType;
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

	public getFileType():string {
		return this.fileType;
	}
}