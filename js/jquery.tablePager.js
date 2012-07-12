/*
* TablePager 1.02, jQuery plugin
*
* Copyright(c) 2012, Adam Radabaugh
*
* Simple AJAX table pagination
* Licensed under the MIT License
*/
(function($) {
	var methods = (function methods(){
		function _getOptions(pager){
			return pager.data("jqv-table-pager");
		}

		function _setOptions(pager, options){
			pager.data("jqv-table-pager", options);
		}

		function _removeOptions(pager){
			pager.removeData("jqv-table-pager");
		}

		function _updatePageDisplay(pager){
			var	options = _getOptions(pager),
				display = "1/1",
				curPage = 0,
				endPage = 1,
				j = 0,
				os = options.offset,
				ps = options.pageSize;

			endPage = Math.ceil(options.resultCount / ps);

			while (true){
				j += ps;
				curPage += 1;
				if ( os < j ) { break; }
			}

			curPage = curPage || 1;
			endPage = endPage || 1;
			display = curPage + "/" + endPage;

			options.pager.find(".page-display").val(display);

			options = display = curPage = endPage = pager = j = os = ps = null;
		}

		function _refreshData(pager){
			var options = _getOptions(pager),
				postObj = $.extend({},
								{"offset": options.offset, "pageSize": options.pageSize},
								options.ajaxData),
				doRequest = true;

			if ( typeof options.beforeRequestCallback === "function" )
			{
				doRequest = options.beforeRequestCallback();
			}

			if ( doRequest !== false )
				$.get(options.requestURL, postObj, function(response){
					if ( typeof response === "string" )
						response = $.parseJSON(response);

					if ( response.max != null && response.max !== "" ) {
						options.resultCount = response.max;
					} else {
						console.error("No `max` was specified in result for jQuery.tablePager.");
						return;
					}

					var tbody = options.requestCallback(response, options);

					if ( typeof options.target === "string" )
						$(options.target).html(tbody);
					else if ( typeof options.target === "object" && typeof options.target.jquery === "string" )
						options.target.html(tbody);

					_setOptions(pager, options);
					_updatePageDisplay(pager);

					if ( typeof options.afterRequestCallback === "function" )
						options.afterRequestCallback();

					response = options = pager = postObj = tbody = null;
				}, "JSON");
		}

		function _firstPage(pager){
			var options = _getOptions(pager);

			if ( options.offset > 0 ) {
				options.offset = 0;
				_setOptions(pager, options);
				_refreshData(pager);
			}

			options = pager = null;
		}

		function _prevPage(pager){
			var options = _getOptions(pager);

			if ( options.offset > 0 && options.offset >= options.pageSize ) {
				options.offset = options.offset - options.pageSize;
				_setOptions(pager, options);
				_refreshData(pager);
			}

			options = pager = null;
		}

		function _nextPage(pager){
			var options = _getOptions(pager);

			if ( options.offset < ( options.resultCount - options.pageSize ) ) {
				options.offset = options.offset + options.pageSize;
				_setOptions(pager, options);
				_refreshData(pager);
			}

			options = pager = null;
		}

		function _lastPage(pager){
			var options = _getOptions(pager),
				ps = options.pageSize,
				rc = options.resultCount,
				j = 0;

			if ( options.offset < ( options.resultCount - options.pageSize ) ) {
				while (true){
					j += ps;
					if ( (rc - j) < ps ) {
						options.offset = j;
						break;
					}
				}

				_setOptions(pager, options);
				_refreshData(pager);
			}

			options = pager = ps = rc = j = null;
		}

		function _drawTable(response, options){
			var tbody = "";

			$.each(response.records, function (i, r){
				tbody = tbody + "<tr>";
				$.each(r, function (j, c){
					tbody = tbody + "<td>" + c + "</td>";
				});
				tbody = tbody + "</tr>";
			});

			return tbody;
		}

		function _setupPager(pager) {
			var options = _getOptions(pager);

			pager.find(options.firstButton).unbind("click.tablePager").bind("click.tablePager", function(e){e.preventDefault();_firstPage(pager);});
			pager.find(options.prevButton).unbind("click.tablePager").bind("click.tablePager", function(e){e.preventDefault();_prevPage(pager);});
			pager.find(options.nextButton).unbind("click.tablePager").bind("click.tablePager", function(e){e.preventDefault();_nextPage(pager);});
			pager.find(options.lastButton).unbind("click.tablePager").bind("click.tablePager", function(e){e.preventDefault();_lastPage(pager);});

			options = null;

			_refreshData(pager);
		}

		function _saveOptions(pager, options) {
			var userOptions = $.extend({
					/**
					* A jQuery selector for the <tbody> tablePager will append records to.
					* -This must be provided during intialization.-
					*
					*/
					target: "",

					/**
					* The URL tablePager will request data from. Can be absolute or relative.
					* -This must be provided during intialization.-
					*
					*/
					requestURL: "",

					/**
					* The max number of records visible in the table at one time and
					* the max to request from the server.
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
					* Before request callback. Allows you to be notified before a
					* request to the server is made. If false is returned, tablePager
					* will cancel the request.
					*
					*/
					beforeRequestCallback: null,

					/**
					* After request callback. Allows you to be notificed after a
					* request has finished (post requestCallback). Useful for any
					* additional UI setup, etc. Returns do nothing.
					*
					*/
					aferRequestCallback: null,

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
				}, options);

			/* Internal Use Only */
			userOptions.offset = 0;
			userOptions.resultCount = userOptions.pageSize;
			userOptions.pager = pager;

			if ( userOptions.target == null || userOptions.target === "" ) {
				console.error("No `target` was specified for jQuery.tablePager.");
				return false;
			}

			if ( userOptions.requestURL == null || userOptions.requestURL === "" ) {
				console.error("No `requestURL` was specified for jQuery.tablePager.");
				return false;
			}

			_setOptions(pager, userOptions);
			userOptions = null;

			return true;
		}

		function destroy() {
			var pager = arguments[0],
				options = _getOptions(pager);

			pager.find(options.firstButton).unbind("click.tablePager");
			pager.find(options.prevButton).unbind("click.tablePager");
			pager.find(options.nextButton).unbind("click.tablePager");
			pager.find(options.lastButton).unbind("click.tablePager");

			_removeOptions(pager);

			return pager;
		}

		function refresh() {
			var pager = arguments[0],
				options = _getOptions(pager);

			options.offset = 0;
			_setOptions(pager, options);
			_refreshData(pager);

			options = null;

			return pager;
		}

		function option() {
			var	pager = arguments[0],
				optionName = arguments[2],
				value = arguments[3],
				options = _getOptions(pager),
				refresh = false;

			if ( value == null ) {
				return ( options.hasOwnProperty(optionName) ) ? options[optionName] : undefined;
			}

			if ( optionName !== "offset" && optionName !== "resultCount" &&
				optionName !== "pager" && options[optionName] )
			{
				options[optionName] = value;

				if ( optionName === "pageSize" || optionName === "requestURL" ||
					optionName === "target" )
				{
					options.offset = 0;
					refresh = true;
				}
			} else {
				return pager;
			}

			_setOptions(pager, options);

			if ( refresh ) {
				_refreshData(pager);
			}

			options = refresh = null;

			return pager;
		}

		function init(pager, options) {
			options = options || {};

			if ( pager.data("jqv-table-pager") == null ) {
				if ( !_saveOptions(pager, options) ) {
					return false;
				}

				_setupPager(pager);
			}

			pager = null;
		}

		return { "init" : init, "option" : option, "refresh" : refresh, "destroy" : destroy };
	}());

	$.fn.tablePager = function() {
		var pager = this,
			args = Array.prototype.slice.call(arguments),
			method = args[0],
			nargs = [];

		if ( !pager[0] ) {
			// stop here if the pager does not exist
			return false;
		}

		if ( typeof method === "string" && method !== "init" && methods[method] ) {
			nargs.push(pager);
			$.each(args, function(i, idx){
				nargs.push(idx);
			});

			// make sure init is called once
			methods.init(pager, method);

			return methods[method].apply(null, nargs);
		} else if ( typeof method === "object" || !method ) {
			// default constructor with or without arguments
			methods.init(pager, method);
		} else {
			console.error("Method " + method + " does not exist in jQuery.tablePager");
		}

		args = method = nargs = null;

		return pager;
	};
}(jQuery));