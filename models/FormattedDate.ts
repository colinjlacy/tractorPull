export class FormattedDate {
	private date: string;

	constructor() {

		var monthNames: string[] = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

		const uglyDate = new Date(),
			hours: number = uglyDate.getHours() < 13 ? uglyDate.getHours() : uglyDate.getHours() - 12,
			minutes: string | number = uglyDate.getMinutes() > 9 ? uglyDate.getMinutes() : "0" + uglyDate.getMinutes(),
			am_pm: string = uglyDate.getHours() < 13 ? "am" : "pm";
		this.date = monthNames[uglyDate.getMonth()] + " " + uglyDate.getDate() + ", " + uglyDate.getFullYear() + " - " + hours + ":" + minutes + am_pm;
	}

	getDate() {
		return this.date;
	}
}