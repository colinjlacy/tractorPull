/**
 * setReportContent
 * @param data: {suites: Suite[], specs: number, specsPassed: number, specsFailed: number, isPrinted: boolean}
 * @returns {string}
*/
function setReportContent(data) {
	var tpl = "";
	// loop through the suites
	for (var suite = 0; suite < data.suites.length; suite++) {
		tpl += '<h3>' + data.suites[suite].suiteFullName + '<small> | Duration: ' + data.suites[suite].suiteDuration + ' seconds</small></h3>' +
			'<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
		// loop through the specs
		for (var spec = 0; spec < data.suites[suite].specs.length; spec++) {
			// sets the background for the panels
			var bg = data.suites[suite].specs[spec].status === "passed" ? "success" : "danger";
			// continues building out the template
			tpl += '<div class="panel panel-' + bg + '">' +
				'<div class="panel-heading" role="tab" id="heading' + suite + "--" +spec + '">' +
				'<h4 class="panel-title">' +
				'<a data-toggle="collapse" data.suites-parent="#accordion" href="#collapse' + suite + "--" +spec + '" aria-expanded="true" aria-controls="collapseOne">' +
				data.suites[suite].specs[spec].shortname +
				'</a>' +
				'</h4>' +
				'</div>' +
				'<div id="collapse' + suite + "--" +spec + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">' +
				'<div class="panel-body">';
			// pass a simple message if it passed
			if (data.suites[suite].specs[spec].status === 'passed') {
				tpl += '<p><strong>Duration: </strong>' + data.suites[suite].specs[spec].duration + ' seconds, <a href="' + data.suites[suite].specs[spec].link + '"><span class="fa fa-picture-o"></span> View Screenshot</a></p>';
			} else if(data.suites[suite].specs[spec].failure) { // pass a list of reasons for failures if it fails
				tpl += '<p><strong>Duration: </strong>' + data.suites[suite].specs[spec].duration + ' seconds</p>';
				for (var fail = 0; fail < data.suites[suite].specs[spec].failure.length; fail++) {
					tpl += '<p><strong>Message: </strong>' + data.suites[suite].specs[spec].failure[fail].message + '</p>' +
						'<p><strong>Stack Trace:</strong></p>' +
						'<p><small>' + data.suites[suite].specs[spec].failure[fail].stack + '</small></p>';
				}
				tpl += '<a href="' + data.suites[suite].specs[spec].link + '"><span class="fa fa-picture-o"></span> View Screenshot</a>' +
					'</p>';
			}


			tpl += '</div>' +
				'</div>' +
				'</div>'
		}

		tpl += '</div>' +
			'<hr/>';

	}

	return tpl;
}

module.exports = setReportContent;