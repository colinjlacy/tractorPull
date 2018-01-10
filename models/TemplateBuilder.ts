import { setHead } from '../templates/setHead.template';
import { setEnd } from '../templates/setEnd.template';
import { setReportContent } from '../templates/setReportContent.template';
import { TestResults } from '../models/TestResults';

export class TemplateBuilder {

	private template: string;

	public constructor(formattedDate: string, dataObj: TestResults) {

		const head: string = setHead(formattedDate, dataObj);

		const report: string = setReportContent(dataObj);

		const end: string = setEnd();

		this.template = head + report + end;

	}

	public getTemplate(): string {
		return this.template;
	}
}