import { TestResults } from '../models/TestResults';

export function setHead(date: string, dataObj: TestResults) {
	return '<!DOCTYPE html>' + `
<head><title>January 12, 2018 - 5:11pm</title>
  <link rel="stylesheet" href="https://bootswatch.com/4/lux/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ekko-lightbox/5.3.0/ekko-lightbox.css">
  <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
</head>
<body>

<div class="header border bg-dark pt-5 pb-2 mb-5">
  <div class="container">
	<div class="row">
	  <div class="col-sm-12">
		<h1 class="display-3 text-muted text-capitalize"><span class="fa fa-file-text-o mr-4"></span>User Guides <span class="text-small">${date}</span></h1>
	  </div>
	</div>
  </div>
</div>
`;
}
