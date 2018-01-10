import jasmine from 'jasmine';
import { ExtendedSpec } from './ExtendedSpec';

export class ExtendedSuite {
	private _suites: ExtendedSuite[];
	private _specs: ExtendedSpec[];
	private _started: number;
	private _finished: number;
	private _parent: ExtendedSuite;
	private _isPrinted: boolean;
	private _description: string;
	private _env: jasmine.Env;
	private _id: number;
	private _parentSuite: jasmine.Suite;
	private _queue: jasmine.Queue;
	private _fullName: string;

	constructor(orig: jasmine.Suite, parent?: ExtendedSuite) {
		this._suites = [];
		this._specs = [];
		this._started = Date.now();
		this._parent = parent;
		this._isPrinted = false;
		this._description = orig.description;
		this._env = orig.env;
		this._id = orig.id;
		this.parentSuite = orig.parentSuite;
		this._queue = orig.queue
	}

	public get fullName():string {
		return this._fullName;
	}

	public getFullName(): string {
		return this._fullName;
	}

	public set fullName(value:string) {
		this._fullName = value;
	}

	public get suites():ExtendedSuite[] {
		return this._suites;
	}

	public set suites(value:ExtendedSuite[]) {
		this._suites = value;
	}

	public get specs():ExtendedSpec[] {
		return this._specs;
	}

	public set specs(value:ExtendedSpec[]) {
		this._specs = value;
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

	public get parent():ExtendedSuite {
		return this._parent;
	}

	public set parent(value:ExtendedSuite) {
		this._parent = value;
	}

	public get isPrinted():boolean {
		return this._isPrinted;
	}

	public set isPrinted(value:boolean) {
		this._isPrinted = value;
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

	public get parentSuite():jasmine.Suite {
		return this._parentSuite;
	}

	public set parentSuite(value:jasmine.Suite) {
		this._parentSuite = value;
	}

	public get queue():jasmine.Queue {
		return this._queue;
	}

	public set queue(value:jasmine.Queue) {
		this._queue = value;
	}
}