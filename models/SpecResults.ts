
export class SpecResults {
	private status: string;
	private link: string;
	private fullname: string;
	private shortname: string;
	private duration: number;
	private failure: {message: string, stack: any}[];

	constructor(spec: any, duration: number, reasonsForFailure: {message: string, stack: any}[]) {
		this.status = spec.status;
		this.link = "./screenshots/" + spec.filename;
		this.fullname = spec.fullName;
		this.shortname = spec.fullName.replace(spec.suite.getFullName(), '').trim();
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