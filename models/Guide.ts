import { Step } from './Step';
import { by, element } from 'protractor';

export class Guide {
	constructor(title: string, desc: string, ...steps: Step[]) {
		const combinationString = `${title}|||${desc}`;
		describe(combinationString, function() {
			steps.forEach((step: Step, ind: number) => {
				let elem: {height: number, width: number, top: number, left: number} = null;
				let self = this;
				it(step.description, function() {
					self['children'][ind].result.title = step.title;
					step.execution.call(this, arguments);
					if(step.target) {
						const el = element(by.css(step.target));
						const sizePromise: any = el.getSize();
						const locationPromise: any = el.getLocation();
						Promise.all([sizePromise, locationPromise])
							.then((res) => {
								elem = {
									height: res[0].height,
									width: res[0].width,
									top: res[1].y,
									left: res[1].x
								};
								self['children'][ind].result.element = elem;
							});
					}
				});
			});
		});
	}
}