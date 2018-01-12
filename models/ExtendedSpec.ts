import { ExtendedSuite } from './ExtendedSuite';
const jasmine = require('jasmine');
const hat = require('hat');

export class ExtendedSpec {
	private started: number;
	private finished: number;
	private filename: string;
	private element: {top: number; left: number; width: number; height: number};
	private description: string;
	private env: jasmine.Env;
	private id: number;
	private results: jasmine.NestedResults;
	private suite: ExtendedSuite;
	private printed: boolean;
	private status: string;
	private passedExpectations: any[];
	private failedExpectations: {message: string, stack: any}[];

	constructor(spec: jasmine.Spec, suite: ExtendedSuite) {
		this.started = Date.now();
		this.filename = hat() + '.png';
		this.description = spec.description;
		this.env = spec.env;
		this.id = spec.id;
		this.suite = suite;
		this.printed = false;
	}

	public getStatus():string {
		return this.status;
	}

	public setStatus(value:string) {
		this.status = value;
	}

	public getFailedExpectations():{message: string, stack: any}[] {
		return this.failedExpectations;
	}

	public setFailedExpectations(value:{message: string, stack: any}[]) {
		this.failedExpectations = value;
	}

	public isPrinted():boolean {
		return this.printed;
	}

	public setPrinted(value:boolean) {
		this.printed = value;
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

	public getFilename():string {
		return this.filename;
	}

	public setFilename(value:string) {
		this.filename = value;
	}

	public getElement():{top: number, left: number, width: number, height: number} {
		return this.element;
	}

	public setElement(value:{top: number, left: number, width: number, height: number}) {
		this.element = value;
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

	public getResults():jasmine.NestedResults {
		return this.results;
	}

	public setResults(value:jasmine.NestedResults) {
		this.results = value;
	}

	public getSuite():ExtendedSuite {
		return this.suite;
	}

	public setSuite(value:ExtendedSuite) {
		this.suite = value;
	}

	public extend(spec: any): void {
		this.failedExpectations = spec.passedExpectations;
		this.failedExpectations = spec.failedExpectations;
		this.status = spec.status;
		this.element = spec.element
	}
}