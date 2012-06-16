# Unofficial FB Javascript SDK Bootstrap

This project is meant to fix all the broken things in the Facebook library. 
Most importantly give it an upgrade so it can work with most modern Javascript techniques, like:
* **Use jQuery events**. No more stuffing everything in `fbAsyncInit` this converts an FB event into a jQuery event("init.fb").
* **Use Deferreds for API calls**. All FB API calls are wrapped in Deferreds calls accodring to JS/Commons 1.0. This allows you to do some amazing things, 
like loading multiple things at the same time.


### Examples:
              
*Listen for some FB events*

```javascript
$(document).bind("load.fb", function() {
  FB.init({
    // stuff
  });
});
```

*No guessing if a post was successful or not, attach relevant success/failure callbacks*

```javascript
_FB.ui({
    method : "post",
    url : "http://www.google.com"
}).then(function() {
	alert("<3 you!");
}, function() {
	alert("You are a donkey.");
});
```

*Load multiple requests at the same time*
```javascript
$.when(_FB.api("/me"), _FB.api("/me/friends")).then(function(user, friends) {
	console.log(user, friends, " loaded at the same time!");
});
```
    
*Pipe your calls for special handling*
```javascript
_FB.api("/me/friends").pipe(function(friends) {
	$.post("/my-api", friends);
}).then(function(friends) {
	alert(friends.data[0] + " is your best friend!");
});
```
    
    