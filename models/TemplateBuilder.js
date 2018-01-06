const setHead               = require('../templates/setHead.template'),
	setEnd                  = require('../templates/setEnd.template'),
	setReportContent        = require('../templates/setReportContent.template');


class TemplateBuilder {
	/**
	 * constructor
	 * @param formattedDate: string
	 * @param dataObj: {suites: Suite[], specs: number, specsPassed: number, specsFailed: number, isPrinted: boolean}
	 * @returns {string}
	 */
	constructor(formattedDate, dataObj) {

		this._template = '';

		var head = setHead(formattedDate, dataObj);

		var report = setReportContent(dataObj);

		var end = setEnd();

		this._template = head + report + end;

	}

	get template() {
		return this._template;
	}
}

module.exports = TemplateBuilder;