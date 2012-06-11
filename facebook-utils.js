;(function(exports, $, Deferred) { 

	"use strict";

	if ( !exports.FB ) {
		$ && $.getScript("//connect.facebook.net/en_US/all.js").done(function() {
			$ && $.event.trigger("load.fb");
		});
	} else {
		enhance(exports.FB);
	}

	exports.fbAsyncInit = function() {
		enhance(exports.FB);
		$ && $.event.trigger("init.fb");
	};

	function enhance(FB) {
		
		var FBX = {
			ui: FB.ui,
			api: FB.api,
			login: FB.login,
			logout: FB.logout,
			getLoginStatus: FB.getLoginStatus
		};
		
		
		$.extend(FB, {
			ui: function(obj) {
				return wrapper(FBX.ui, arguments, function(r, d) {
					switch( obj.method ) {
						case "feed": r && r.post_id? d.resolve(r) : d.reject(r); break;
						case "pay": r && r.order_id ? d.resolve(r) : d.reject(r); break;
						case "apprequests": r && r.to? d.resolve(r) : d.reject(r); break;
						case "send": d.resolve(r); break;
						default: d.resolve(r);
					}
				});
			},
			
			api: function() {
				return wrapper(FBX.api, arguments, function(r,d) {
					(r.error || r.error_code ? d.reject(r) : d.resolve(r));
				});
			},
	
			login: function() {
				return wrapper(FBX.login, arguments, function(r,d) {
					r.authResponse ? d.reject(r) : d.resolve(r);
				});
			},
			
			logout: function() {
				return wrapper(FBX.logout, arguments);
			},
			
			getLoginStatus: function() {
				return wrapper(FBX.getLoginStatus, arguments);
			}
		});

		function wrapper(target, args, fn) {
			var defer = Deferred(), 
				arr = Array.prototype.slice.apply(args),
				fn = fn || function(r,d) { d.resolve(r); };
			
			typeof(arr[arr.length - 1])  === "function" &&
				defer.always(arr.pop());
			
			arr.push(function(response) {
				fn.call(this, response, defer);
			});
			
			return target.apply(this, arr), defer;
		};
		
	};

} (window, jQuery, jQuery.Deferred));