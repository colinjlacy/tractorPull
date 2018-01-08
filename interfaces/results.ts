import jasmine from 'jasmine';

export interface iResults {
	specsPassed: number;
	specsFailed: number;
}

export interface iSuiteResults extends iResults {
	suiteFullName: string;
	suiteDuration: number;
	childSuites: jasmine.Suite[];
	specs: jasmine.Spec[];
}

export interface iTestResults extends iResults {
	suites: iSuiteResults[];
	specs: number;
}

export type iSpecResults = {
	status: string;
	link: string;
	fullname: string;
	shortname: string;
	duration: number;
	failure: string[];
}