const jasmine = require('jasmine');
import { ExtendedSpec } from './ExtendedSpec';

export class ExtendedSuite {
	private suites: ExtendedSuite[];
	private specs: ExtendedSpec[];
	private started: number;
	private finished: number;
	private parent: ExtendedSuite;
	private printed: boolean;
	private description: string;
	private env: jasmine.Env;
	private id: number;
	private parentSuite: jasmine.Suite;
	private queue: jasmine.Queue;
	private fullName: string;

	constructor(orig: jasmine.Suite, parent?: ExtendedSuite) {
		this.suites = [];
		this.specs = [];
		this.started = Date.now();
		this.parent = parent;
		this.printed = false;
		this.description = orig.description;
		this.env = orig.env;
		this.id = orig.id;
		this.parentSuite = orig.parentSuite;
		this.queue = orig.queue
	}

	public getFullName(): string {
		return this.fullName;
	}

	public setFullName(value:string) {
		this.fullName = value;
	}

	public getSuites():ExtendedSuite[] {
		return this.suites;
	}

	public setSuites(value:ExtendedSuite[]) {
		this.suites = value;
	}

	public getSpecs():ExtendedSpec[] {
		return this.specs;
	}

	public setSpecs(value:ExtendedSpec[]) {
		this.specs = value;
	}

	public getStarted():number {
		return this.started;
	}

	public setStarted(value:number) {
		this.started = value;
	}

	public getFinished():number {
		return this.finished;
	}

	public setFinished(value:number) {
		this.finished = value;
	}

	public getParent():ExtendedSuite {
		return this.parent;
	}

	public setParent(value:ExtendedSuite) {
		this.parent = value;
	}

	public isPrinted():boolean {
		return this.printed;
	}

	public setPrinted(value:boolean) {
		this.printed = value;
	}

	public getDescription():string {
		return this.description;
	}

	public setDescription(value:string) {
		this.description = value;
	}

	public getEnv():jasmine.Env {
		return this.env;
	}

	public setEnv(value:jasmine.Env) {
		this.env = value;
	}

	public getId():number {
		return this.id;
	}

	public setId(value:number) {
		this.id = value;
	}

	public getParentSuite():jasmine.Suite {
		return this.parentSuite;
	}

	public setParentSuite(value:jasmine.Suite) {
		this.parentSuite = value;
	}

	public getQueue():jasmine.Queue {
		return this.queue;
	}

	public setQueue(value:jasmine.Queue) {
		this.queue = value;
	}
}