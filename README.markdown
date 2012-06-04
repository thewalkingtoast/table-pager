jQuery Table Pager Plugin
======================

##Introduction

This jQuery plugin is meant to simplifiy client-side table paging. Simply point the plugin at
a GET URL and attach the pager markup and it will handle min/max/sizing and paging.

##Requirements

- jQuery 1.6

##Demo Requirements

- A web server running PHP5.2+

##Getting Started

To get started, download either `jquery.tablePager.js` (uncompressed) or `jquery.tablePager.min.js`
(compressed) JavaScript file and include it in your HTML:

```HTML
<script src="js/jquery.tablePager.min.js"></script>
```

Provide an HTML table complete with `tbody`:

```HTML
<table>
	<thead>
		<th>Username</th>
		<th>Phone</th>
	</thead>
	<tbody id="user-list">

	</tbody>
	<tfoot>
	</tfoot>
</table>
```

Next, add the pager HTML markup (a good place for this in the `tfoot` of the aforementioned table):

```HTML
<div id="pager">
	<span class="first-page">
		<a href="#">First</a>
	</span>
	<span class="prev-page">
		<a href="#">Previous</a>
	</span>
	<input type="text" class="page-display" readonly="readonly" value="1/1">
	<span class="next-page">
		<a href="#">Next<a/>
	</span>
	<span class="last-page">
		<a href="#">Last</a>
	</span>
</div>
```

Then, in your jQuery `$(document).ready()`, or elsewhere, to initiate tablePager:

```JavaScript
$("#pager").tablePager({
	target: "#user-list",
	requestURL: "/Users/list"
});
```

##Server Request

By default, tablePager will send a GET request to the `requestURL` you provide with the following parameters:

```JavaScript
offset: 0 // The current integer offset of data in the table view
pageSize: 20 // The requested amount of records from the offset tablePager expects back
```

You can override `pageSize` and also add you own custom parameters to this request. See Configuration below.

##Server Response

tablePager expects a JSON response in the following format:

```JavaScript
{
	max: 0, // The maximum available records in the data set for calculation total number of pages
	records: [] // The actual data in this given page of the data set
}
```

##Example

tablePager sends:

```JavaScript
offset: 0
pageSize: 2
```

Server responds:

```JavaScript
{
	max: 6,
	records: [
		["User 1", "555-1001"],
		["User 2", "555-1002"]
	]
}
```

The `records` property can be either an array or an object literal containing either arrays or object literals. Any mix will do provided the structure is enumerable.

##Available Methods

#refresh

Refreshes the table data by re-requesting data from the server "in-place" (using the same offset and pageSize as before).

```JavaScript
.tablePager("refresh");
```

#option

Get or set any tablePager option. If no value is specified, will act as a getter. Note that some may auto-trigger a refresh (see Configuration below).

```JavaScript
.tablePager("option", optionName, [value]);
```

Example:

```JavaScript
$("#pager").tablePager("option", "pageSize", 40); // Sets pageSize to 40;
$("#pager").tablePager("option", "pageSize"); // Returns the value of pageSize;
```

#destroy

Remove the tablePager functionality completely. This will return the pager element back to its pre-init state.

```JavaScript
.tablePager("destroy");
```

Example:

```JavaScript
$("#pager").tablePager("destroy");
```

##Configuration

tablePager provides a few different options for you to override (the values shown are defaults):

```JavaScript
{
	/**
	* A jQuery selector for the <tbody> tablePager will append records to.
	* Triggers an auto-refresh when set via option method. Resets offset to 0.
	*
	* -This must be provided during intialization.-
	*
	*/
	target: "",
	
	/**
	* The URL tablePager will request data from. Can be absolute or relative.
	* Triggers an auto-refresh when set via option method. Resets offset to 0.
	*
	* -This must be provided during intialization.-
	*
	*/
	requestURL: "",
	
	/**
	* The max number of records visible in the table at one time and
	* the max to request from the server. Triggers an auto-refresh
	* when set via option method. Resets offset to 0.
	*
	*/
	pageSize: 20,
	
	/**
	* Any additional data you wish tablePager to send to the server when it
	* is requesting the page change records.
	*
	*/
	ajaxData: {},
	
	/**
	* The function to call for drawing once a response is received.
	* By default, tablePager uses an interal function that simply iterates the
	* response record set making plain <tr><td></td><tr> markup.
	*
	* Provide your own function to customize the drawing behavior of tablePager.
	* Must return the complete HTML as a string or a jQuery object.
	*
	*/
	requestCallback: _drawTable,
	
	/**
	* The jQuery selector for the 'first button' in the pager.
	*
	*/
	firstButton: ".first-page",
	
	/**
	* The jQuery selector for the 'previous button' in the pager.
	*
	*/
	prevButton: ".prev-page",
	
	/**
	* The jQuery selector for the 'next button' in the pager.
	*
	*/
	nextButton: ".next-page",
	
	/**
	* The jQuery selector for the 'last button' in the pager.
	*
	*/
	lastButton: ".last-page"
}
```

##Demo Application

There is a demo application built for your reference provided.

##Getting Help

If you need help with jQuery Table Pager, please open an issue.

##License

Licensed under the MIT License

Copyright (c) 2012 Adam Radabaugh

Permission is hereby granted, free of charge, to any person obtaining a copy of this software
and associated documentation files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.