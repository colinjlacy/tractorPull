import { Options } from './Options';
import { ExtendedSuite } from './ExtendedSuite';
import { ExtendedSpec } from './ExtendedSpec';
import { ElementLocation } from './ElementLocation';
import * as _ from 'lodash';
const jasmine = require('jasmine');

export class Validator {

	private opts: Options;

	constructor(opts: Options) {
		this.opts = opts;
	}

	isSpecValid(spec: ExtendedSpec) {
		// Don't screenshot skipped specs
		var isSkipped = this.opts.isIgnoreSkippedSpecs() && spec.getStatus() === 'pending';
		// Screenshot only for failed specs
		var isIgnored = this.opts.isCaptureOnlyFailedSpecs() && spec.getStatus() !== 'failed';

		return !isSkipped && !isIgnored;
	}

	hasValidSpecs(suite: ExtendedSuite): boolean {
		let validSuites: boolean = false;
		let validSpecs: boolean = false;

		if (suite.getSuites().length) {
			validSuites = suite.getSuites().some((s: ExtendedSuite): boolean => this.hasValidSpecs(s));
		}

		if (suite.getSpecs().length) {
			validSpecs = suite.getSpecs().some((s: ExtendedSpec): boolean => this.isSpecValid(s));
		}

		return !!validSuites || !!validSpecs;
	}

	public stayWithinBounds(width: number, height: number, element: {width: number, height: number, top: number, left: number}, padding: number = 60): ElementLocation {
		const revisedLeft = element.left < width ? element.left : 0;
		const revisedTop = element.top < height ? element.top : 0;
		const revisedWidth = (element.left + element.width) < width ? element.width : width - revisedLeft;
		const revisedHeight = (element.top + element.height) < height ? element.height : height - revisedTop;

		console.log('revisedLeft',revisedLeft);

		const finalLeft = revisedLeft > padding ? revisedLeft - padding : 0;
		const finalTop = revisedTop > padding ? revisedTop - padding : 0;
		const finalWidth = (width - revisedWidth + revisedLeft) > padding ? revisedWidth + (revisedLeft - finalLeft) + padding : width - revisedWidth + revisedLeft;
		const finalHeight = (height - revisedHeight + revisedTop) > padding ? revisedHeight + (revisedTop - finalTop) + padding : height - revisedHeight + revisedTop;

		return new ElementLocation(finalTop, finalLeft, finalHeight, finalWidth);
	}
}
