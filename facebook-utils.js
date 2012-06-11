;(function(exports, Deferred, $) { 

	"use strict";

	/** 
	 * Get the library if it is not available.
	 */
	if( exports._FB ) { 
		return;
	} else if ( !exports.FB ) {
		$ && $.getScript("//connect.facebook.net/en_US/all.js");
	} else {
		setup(exports.FB);
	}

	
	/**
	 * Preserve the callback, and then wrap it
	 * make it generic and trigger it.
	 */
	var fbAsyncInit = exports.fbAsyncInit;
	exports.fbAsyncInit = function() {
		setup(exports.FB);
		fbAsyncInit && fbAsyncInit();
		$ && $.event.trigger("load.fb");
	};

	
	/**
	 * Bind Deferred to FB methods
	 */
	function setup(/*FB[object]*/ FB) {
		var override = [ "ui", "logout", "getLoginStatus" ],
			_FB = function _FB() {
			
				for(var i = 0; i < override.length; i++) {
					this[override[i]] = bind(FB[override[i]], function(r,d) {
						r && r.post_id || r.order_id || r.to || r.status ?
								d.resolve(r) : d.reject(r);
					});
				}
				
				this["login"] = bind(FB.login, function(r,d) {
					r && r.authResponse ? d.resolve(r) : d.reject(r);
				});
				
				this["api"] = bind(FB.api, function(r,d) {
					r && r.error || r.error_code? d.reject(r) : d.resolve(r); 
				});
		};

		_FB.prototype = FB;
		exports._FB = new _FB();		
	};
	
	
	/** 
	 * Helper method used in setup that acts
	 * as the pipe between FB API calls and Deferred 
	 * objects.
	 */
	function bind(/* FB.*[object] */ target, /* Function */ fn) {
		return function() {
			var defer = Deferred(),
				arr = Array.prototype.slice.apply(arguments);
			
			typeof arr[arr.length - 1]  === "function" &&
				defer.always(arr.pop());
			
			arr.push(function(response) {
				fn.call(this, response, defer);
			});
			
			return target.apply(this, arr), defer;
		};
	};
	
} (window, window.jQuery.Deferred, $));