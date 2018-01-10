import { SpecResults } from './SpecResults';
import { ExtendedSpec } from './ExtendedSpec';
import { ExtendedSuite } from './ExtendedSuite';

export class SuiteResults {
	private suiteFullName: string;
	private suiteDuration: number;
	private childSuites: ExtendedSuite[];
	private specs: SpecResults[];
	private specsPassed: number;
	private specsFailed: number;


	public constructor(suiteFullName:string, suiteDuration:number) {
		this.suiteFullName = suiteFullName;
		this.suiteDuration = suiteDuration;
		this.specs = [];
		this.childSuites = [];
		this.specsPassed = 0;
		this.specsFailed = 0;
	}

	public getSuiteFullName():string {
		return this.suiteFullName;
	}

	public getSuiteDuration():number {
		return this.suiteDuration;
	}

	public getChildSuites():ExtendedSuite[] {
		return this.childSuites;
	}

	public getSpecs():SpecResults[] {
		return this.specs;
	}

	public getSpecsPassed():number {
		return this.specsPassed;
	}

	public getSpecsFailed():number {
		return this.specsFailed;
	}

	public addSpec(spec: SpecResults): void {
		this.specs.push(spec);
	}

	public addChildSuite(suite: any): void {
		this.childSuites.push(suite);
	}

	public incrementSpecsPassed(): void {
		this.specsPassed++;
	}

	public incrementSpecsFailed(): void {
		this.specsFailed++;
	}

	public printResults(): SuiteResults {
		return this;
	}
}