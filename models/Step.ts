import { browser, by, element } from 'protractor';

export class Step {

	constructor(private _title:string, private _description:string, private _target:string, private _execution:(done?: any) => void) {}

	public get title():string {
		return this._title;
	}

	public set title(value:string) {
		this._title = value;
	}

	public get description():string {
		return this._description;
	}

	public set description(value:string) {
		this._description = value;
	}

	public get target():string {
		return this._target;
	}

	public set target(value:string) {
		this._target = value;
	}

	public get execution():(p1?:any)=>void {
		return this._execution;
	}

	public set execution(value:(p1?:any)=>void) {
		this._execution = value;
	}

}
