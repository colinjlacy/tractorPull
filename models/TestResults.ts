import { iTestResults } from '../interfaces/results';
import { SuiteResults } from './SuiteResults';

export class TestResults implements iTestResults {
	private _suites: SuiteResults[];
	private _specs: number;
	private _specsPassed: number;
	private _specsFailed: number;

	public constructor() {
		this._suites = [];
		this._specs = 0;
		this._specsPassed = 0;
		this._specsFailed = 0;
	}

	public get suites():SuiteResults[] {
		return this._suites;
	}

	public get specs():number {
		return this._specs;
	}

	public get specsPassed():number {
		return this._specsPassed;
	}

	public get specsFailed():number {
		return this._specsFailed;
	}

	public addSuite(suite: SuiteResults): void {
		this._suites.push(suite);
		this._specs += suite.specs.length;
		this._specsPassed += suite.specsPassed;
		this._specsFailed += suite.specsFailed;
	}

	public print(): TestResults {
		return this;
	}
}