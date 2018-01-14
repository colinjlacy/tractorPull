import { ExtendedSpec } from './ExtendedSpec';

export class SpecResults {
	private status: string;
	private link: string;
	private thumb: string;
	private title: string;
	private description: string;
	private duration: number;
	private failure: {message: string, stack: any}[];

	constructor(spec: ExtendedSpec, duration: number, reasonsForFailure: {message: string, stack: any}[]) {
		this.status = spec.getStatus();
		this.link = "./screenshots/" + spec.getFilename();
		this.thumb = "./screenshots/thumbs/" + spec.getFilename();
		this.title = spec.getTitle();
		this.description = spec.getDescription();
		this.duration = duration;
		this.failure = reasonsForFailure;
	}

	public getStatus():string {
		return this.status;
	}

	public getLink():string {
		return this.link;
	}

	public getThumb(): string {
		return this.thumb;
	}

	public getTitle():string {
		return this.title;
	}

	public getDescription():string {
		return this.description;
	}

	public getDuration():number {
		return this.duration;
	}

	public getFailure():{message: string, stack: any}[] {
		return this.failure;
	}

	public setFailure(value:{message: string, stack: any}[]) {
		this.failure = value;
	}
}