;(function(exports, Deferred, $) { 

	"use strict";

	if( exports.FBX ) { 
		return;
	} else if ( !exports.FB ) {
		$ && $.getScript("//connect.facebook.net/en_US/all.js");
	} else {
		setup(exports.FB);
	}

	exports.fbAsyncInit = function() {
		setup(exports.FB);
		$ && $.event.trigger("init.fb");
	};

	function setup(FB) {

		var override = [ "ui", "login", "logout", "getLoginStatus" ],
			FBX = function FBX() {
				for(var i = 0; i < override.length; i++) {
					this[override[i]] = proxy(FB[override[i]]);
				}
				
				this["api"] = proxy(FB.api, function(r,d) {
					r.error || r.error_code? d.reject(r) : d.resolve(r); 
				});
		};

		FBX.prototype = FB;
		exports.FBX = new FBX();
		
	};
	
	function proxy(target, fn) {
		
		fn = fn || check;
		
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
	
	function check(r,d) {
		return (r && r.post_id || r.order_id || r.to || r.status ?
					d.resolve(r) : d.reject(r));
	};
	
} (window, window.jQuery.Deferred, $));