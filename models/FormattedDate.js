class FormattedDate {
	constructor() {
		this._date = null;

		var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

		const uglyDate = new Date(),
			hours = uglyDate.getHours() < 13 ? uglyDate.getHours() : uglyDate.getHours() - 12,
			minutes = uglyDate.getMinutes() > 9 ? uglyDate.getMinutes() : "0" + uglyDate.getMinutes(),
			am_pm = uglyDate.getHours() < 13 ? "am" : "pm";
		const formattedDate = monthNames[uglyDate.getMonth()] + " " + uglyDate.getDate() + ", " + uglyDate.getFullYear() + " - " + hours + ":" + minutes + am_pm;

		this._date = formattedDate;
	}

	get date() {
		return this._date;
	}

	set date(value) {
		this._date = value;
	}

}

module.exports =  FormattedDate;