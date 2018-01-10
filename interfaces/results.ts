import { ExtendedSpec } from '../models/ExtendedSpec';
import { ExtendedSuite } from '../models/ExtendedSuite';
import { SpecResults } from '../models/SpecResults';

export interface iResults {
	specsPassed: number;
	specsFailed: number;
}

export interface iSuiteResults extends iResults {
	suiteFullName: string;
	suiteDuration: number;
	childSuites: ExtendedSuite[];
	specs: SpecResults[];
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
	failure: {message: string, stack: any}[];
}