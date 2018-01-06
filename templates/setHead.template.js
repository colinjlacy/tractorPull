/**
 * setHead
 * @param date: string
 * @param dataObj: {suites: Suite[], specs: number, specsPassed: number, specsFailed: number, isPrinted: boolean}
 * @returns {string}
 */

function setHead(date, dataObj) {
	return '<!DOCTYPE html>' +
		'<head>' +
		'<title>' + date + '</title>' +
		'<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">' +
		'<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap-theme.min.css">' +
		'<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">' +
		'<style> .spec-passed { background-color: #dff0d8; } .spec-failed { background-color: #f2dede; } </style>' +
		'</head>' +
		'<body>' +
		'<div class="container"><div class="row">' +
		'<div class="col-sm-12">' +
		'<h1>Report: ' + date + '</h1>' +
		'<hr/>' +
		'<h2>Test Suites Run: ' + dataObj.suites.length + '</h2>' +
		'<hr/>' +
		'<div class="row">' +
		'<div class="col-sm-4">' +
		'<h3 class="text-muted"><span class="fa fa-exclamation-circle"></span> Total Specs Run: ' + dataObj.specs + '</h3>' +
		'</div>' +
		'<div class="col-sm-4">' +
		'<h3 class="text-muted"><span class="fa fa-check-circle text-success"></span> Specs Passed: ' + dataObj.specsPassed + '</h3>' +
		'</div>' +
		'<div class="col-sm-4">' +
		'<h3 class="text-muted"><span class="fa fa-times-circle text-danger"></span> Specs Failed: ' + dataObj.specsFailed + '</h3>' +
		'</div>' +
		'</div>' +
		'<hr/>';
}

module.exports = setHead;