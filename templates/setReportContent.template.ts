import { TestResults } from '../models/TestResults';
import { ExtendedSuite } from '../models/ExtendedSuite';
import { ExtendedSpec } from '../models/ExtendedSpec';
import { SpecResults } from '../models/SpecResults';
import { SuiteResults } from '../models/SuiteResults';

export function setReportContent(data: TestResults) {
	const suites = data.getSuites();

	const templateStart: string = `
	<div class="container">
	  <div class="row">
		<div class="col-sm-4 col-md-3">
		  <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">`;

	let tabNavigation: string = '';
	suites.forEach((suite: SuiteResults, ind: number) => {
		// TODO: need to kabob-case suite names for the element ID
		tabNavigation += `
			<a class="nav-link ${ind === 0 ? 'active' : ''}" id="${suite.getSuiteKebobName()}-tab" data-toggle="pill" href="#${suite.getSuiteKebobName()}" role="tab" aria-controls="${suite.getSuiteKebobName()}" aria-selected="true">${suite.getSuiteFullName()}</a>`
	});
	tabNavigation += `</div></div>`;


	let panels: string = `<div class="col-sm-8 col-sm-9"><div class="tab-content" id="v-pills-tabContent">`;
	suites.forEach((suite: SuiteResults, ind: number) => {
		panels += `<div class="tab-pane fade  ${ind === 0 ? 'show active' : ''}" id="${suite.getSuiteKebobName()}" role="tabpanel" aria-labelledby="${suite.getSuiteKebobName()}-tab"><ul class="list-unstyled">`;
		suite.getSpecs().forEach((spec: SpecResults) => {
			panels += `
			<li class="media mb-5">
			  <div class="media-body">
				<h5 class="mt-0 mb-1">${spec.getTitle()}</h5>
				${spec.getDescription()}
			  </div>
			  <a href="${spec.getLink()}" data-toggle="lightbox" data-gallery="example-gallery" data-title="${spec.getTitle()}">
				<img class="ml-3" src="${spec.getThumb()}" alt="${spec.getTitle()}">
			  </a>
			</li>
			`;
		});
		panels += `</ul></div>`;
	});
	panels += `</div></div>`;

	const templateEnd: string = `</div></div>
	<div class="footer bg-dark p-5 text-right">
	  <div class="container">
		<div class="row">
		  <div class="col-sm-12">
			<h4 class="text-muted">Made with jazz hands by</h4>
			<h1 class="text-muted text-capitalize display-4 font-weight-bold">Instrum</h1>
		  </div>
		</div>
	  </div>
	</div>`;

	return templateStart + tabNavigation + panels + templateEnd;
}
