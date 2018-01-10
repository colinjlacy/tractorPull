import { SuiteResults } from './SuiteResults';

export class TestResults {
	private suites: SuiteResults[];
	private specs: number;
	private specsPassed: number;
	private specsFailed: number;

	public constructor() {
		this.suites = [];
		this.specs = 0;
		this.specsPassed = 0;
		this.specsFailed = 0;
	}

	public getSuites():SuiteResults[] {
		return this.suites;
	}

	public getSpecs():number {
		return this.specs;
	}

	public getSpecsPassed():number {
		return this.specsPassed;
	}

	public getSpecsFailed():number {
		return this.specsFailed;
	}

	public addSuite(suite: SuiteResults): void {
		this.suites.push(suite);
		this.specs += suite.getSpecs().length;
		this.specsPassed += suite.getSpecsPassed();
		this.specsFailed += suite.getSpecsFailed();
	}

	public print(): TestResults {
		return this;
	}
}