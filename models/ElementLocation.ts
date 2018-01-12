export class ElementLocation {
	private top: number;
	private left: number;
	private height: number;
	private width: number;

	constructor(top:number, left:number, height:number, width:number) {
		this.top = top;
		this.left = left;
		this.height = height;
		this.width = width;
	}

	getHeight(): number {
		return this.height;
	}

	getWidth(): number {
		return this.width;
	}

	getTop(): number {
		return this.top;
	}

	getLeft(): number {
		return this.left;
	}
}