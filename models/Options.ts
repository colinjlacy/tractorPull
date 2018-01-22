import { iOptions } from '../interfaces/options';

export class Options {

	private title: string;
	private imagePath: string;
	private fileName: string;
	private ignoreSkippedSpecs: boolean;
	private fileType: string;

	constructor(init: iOptions) {
		this.title                      = init.title || 'User Guides';
		this.imagePath                  = init.imagePath || './results/screenshots/';
		this.fileType					= '.' + init.fileType || '.html';
		this.fileName                   = init.fileName || './results/report' + this.fileType;
	}

	public getTitle(): string {
		return this.title;
	}

	public getImagePath(): string {
		return this.imagePath;
	}

	public getFileName(): string {
		return this.fileName;
	}

	public getFileType():string {
		return this.fileType;
	}
}