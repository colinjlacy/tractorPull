import { iSpecResults } from '../interfaces/results';

export class SpecResults implements iSpecResults {
	private _status: string;
	private _link: string;
	private _fullname: string;
	private _shortname: string;
	private _duration: number;
	private _failure: {message: string, stack: any}[];

	constructor(spec: any, duration: number, reasonsForFailure: {message: string, stack: any}[]) {
		this._status = spec._status;
		this._link = "./screenshots/" + spec.filename;
		this._fullname = spec._fullname;
		this._shortname = spec.fullName.replace(spec._suite.fullName, '').trim();
		this._duration = duration;
		this._failure = reasonsForFailure;
	}

	public get status():string {
		return this._status;
	}

	public get link():string {
		return this._link;
	}

	public get fullname():string {
		return this._fullname;
	}

	public get shortname():string {
		return this._shortname;
	}

	public get duration():number {
		return this._duration;
	}

	public get failure():{message: string, stack: any}[] {
		return this._failure;
	}

	public set failure(value:{message: string, stack: any}[]) {
		this._failure = value;
	}
}