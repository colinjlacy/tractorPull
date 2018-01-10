import { iSuiteResults } from '../interfaces/results';
import { SpecResults } from './SpecResults';
import { ExtendedSpec } from './ExtendedSpec';
import { ExtendedSuite } from './ExtendedSuite';
import jasmine from 'jasmine';

export class SuiteResults implements iSuiteResults {
	private _suiteFullName: string;
	private _suiteDuration: number;
	private _childSuites: ExtendedSuite[];
	private _specs: SpecResults[];
	private _specsPassed: number;
	private _specsFailed: number;


	public constructor(suiteFullName:string, suiteDuration:number) {
		this._suiteFullName = suiteFullName;
		this._suiteDuration = suiteDuration;
		this._specs = [];
		this._childSuites = [];
		this._specsPassed = 0;
		this._specsFailed = 0;
	}

	public get suiteFullName():string {
		return this._suiteFullName;
	}

	public get suiteDuration():number {
		return this._suiteDuration;
	}

	public get childSuites():ExtendedSuite[] {
		return this._childSuites;
	}

	public get specs():SpecResults[] {
		return this._specs;
	}

	public get specsPassed():number {
		return this._specsPassed;
	}

	public get specsFailed():number {
		return this._specsFailed;
	}

	public addSpec(spec: SpecResults): void {
		this._specs.push(spec);
	}

	public addChildSuite(suite: any): void {
		this._childSuites.push(suite);
	}

	public incrementSpecsPassed(): void {
		this._specsPassed++;
	}

	public incrementSpecsFailed(): void {
		this._specsFailed++;
	}

	public printResults(): SuiteResults {
		return this;
	}
}