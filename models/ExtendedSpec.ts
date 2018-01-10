import { ExtendedSuite } from './ExtendedSuite';
const jasmine = require('jasmine');
const hat = require('hat');

export class ExtendedSpec {
	private _started: number;
	private _finished: number;
	private _filename: string;
	private _element: {top: number; left: number; width: number; height: number};
	private _description: string;
	private _env: jasmine.Env;
	private _id: number;
	private _results_: jasmine.NestedResults;
	private _suite: ExtendedSuite;
	private _isPrinted: boolean;
	private _status: string;
	private _failedExpectations: {message: string, stack: any}[];

	constructor(spec: jasmine.Spec, suite: ExtendedSuite) {
		this._started = Date.now();
		this._filename = hat() + '.png';
		this._description = spec.description;
		this._env = spec.env;
		this._id = spec.id;
		this._suite = suite;
	}


	public get status():string {
		return this._status;
	}

	public set status(value:string) {
		this._status = value;
	}

	public get failedExpectations():{message: string, stack: any}[] {
		return this._failedExpectations;
	}

	public set failedExpectations(value:{message: string, stack: any}[]) {
		this._failedExpectations = value;
	}

	public get isPrinted():boolean {
		return this._isPrinted;
	}

	public set isPrinted(value:boolean) {
		this._isPrinted = value;
	}

	public get started():number {
		return this._started;
	}

	public set started(value:number) {
		this._started = value;
	}

	public get finished():number {
		return this._finished;
	}

	public set finished(value:number) {
		this._finished = value;
	}

	public get filename():string {
		return this._filename;
	}

	public set filename(value:string) {
		this._filename = value;
	}

	public get element():{top: number, left: number, width: number, height: number} {
		return this._element;
	}

	public set element(value:{top: number, left: number, width: number, height: number}) {
		this._element = value;
	}

	public get description():string {
		return this._description;
	}

	public set description(value:string) {
		this._description = value;
	}

	public get env():jasmine.Env {
		return this._env;
	}

	public set env(value:jasmine.Env) {
		this._env = value;
	}

	public get id():number {
		return this._id;
	}

	public set id(value:number) {
		this._id = value;
	}

	public get results_():jasmine.NestedResults {
		return this._results_;
	}

	public set results_(value:jasmine.NestedResults) {
		this._results_ = value;
	}

	public get suite():ExtendedSuite {
		return this._suite;
	}

	public set suite(value:ExtendedSuite) {
		this._suite = value;
	}
}