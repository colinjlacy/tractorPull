import { TestResults } from '../models/TestResults';
import { ExtendedSuite } from '../models/ExtendedSuite';
import { ExtendedSpec } from '../models/ExtendedSpec';
import { SpecResults } from '../models/SpecResults';
import { SuiteResults } from '../models/SuiteResults';

export function setReportContent(data: TestResults) {
	var tpl = "";

	// loop through the suites
	data.getSuites().forEach((suite: SuiteResults, suiteInd: number) => {
		tpl += '<h3>' + suite.getSuiteFullName() + '<small> | Duration: ' + suite.getSuiteDuration() + ' seconds</small></h3>' +
			'<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';

		// loop through the specs
		suite.getSpecs().forEach((spec: SpecResults, specInd: number) => {
			// sets the background for the panels
			var bg = spec.getStatus() === "passed" ? "success" : "danger";
			// continues building out the template
			tpl += '<div class="panel panel-' + bg + '">' +
				'<div class="panel-heading" role="tab" id="heading' + suiteInd + "--" + specInd + '">' +
				'<h4 class="panel-title">' +
				'<a data-toggle="collapse" data.suites-parent="#accordion" href="#collapse' + suiteInd + "--" + specInd + '" aria-expanded="true" aria-controls="collapseOne">' +
				spec.getShortname() +
				'</a>' +
				'</h4>' +
				'</div>' +
				'<div id="collapse' + suiteInd + "--" + specInd + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">' +
				'<div class="panel-body">';

			// pass a simple message if it passed
			if (spec.getStatus() === 'passed') {
				tpl += '<p><strong>Duration: </strong>' + spec.getDuration() + ' seconds, <a href="' + spec.getLink() + '"><span class="fa fa-picture-o"></span> View Screenshot</a></p>';
			} else if(spec.getFailure()) { // pass a list of reasons for failures if it fails
				tpl += '<p><strong>Duration: </strong>' + spec.getDuration() + ' seconds</p>';

				spec.getFailure().forEach((failure: {message: string, stack: any}) => {
					tpl += '<p><strong>Message: </strong>' + failure.message + '</p>' +
						'<p><strong>Stack Trace:</strong></p>' +
						'<p><small>' + failure.stack + '</small></p>';
				});

				tpl += '<a href="' + spec.getLink() + '"><span class="fa fa-picture-o"></span> View Screenshot</a>' +
					'</p>';
			}

			tpl += '</div>' +
				'</div>' +
				'</div>'
		});

		tpl += '</div>' +
			'<hr/>';

	});

	return tpl;
}
