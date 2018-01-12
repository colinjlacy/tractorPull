import { ExtendedSpec } from './ExtendedSpec';

export class SpecResults {
	private status: string;
	private link: string;
	private fullname: string;
	private shortname: string;
	private duration: number;
	private failure: {message: string, stack: any}[];

	constructor(spec: ExtendedSpec, duration: number, reasonsForFailure: {message: string, stack: any}[]) {
		this.status = spec.getStatus();
		this.link = "./screenshots/" + spec.getFilename();
		this.fullname = spec.getSuite().getFullName() + ' ' ;
		this.shortname = spec.getDescription();
		this.duration = duration;
		this.failure = reasonsForFailure;
	}

	public getStatus():string {
		return this.status;
	}

	public getLink():string {
		return this.link;
	}

	public getFullname():string {
		return this.fullname;
	}

	public getShortname():string {
		return this.shortname;
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