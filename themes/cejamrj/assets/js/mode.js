

// Use cookies to allow cross sub-domain preferences
function setCookie(name, value) {
	var expires = '';
	var date = new Date();
	var domain = location.host.indexOf('datatables.net') !== -1
		? '; domain=datatables.net'
		: '';

	date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
	expires = '; expires=' + date.toUTCString();

	document.cookie = name + '=' + (value || '') + expires + domain + '; SameSite=Lax; path=/';
}

function getCookie(name) {
	var nameEQ = name + '=';
	var ca = document.cookie.split(';');

	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];

		while (c.charAt(0) == ' ') {
			c = c.substring(1, c.length);
		}

		if (c.indexOf(nameEQ) == 0) {
			return c.substring(nameEQ.length, c.length);
		}
	}

	return null;
}


(function(){

// Set the colour mode as soon as possible to attempt to avoid FOUC
var mode = getCookie('dt-scheme');

if (mode === 'dark') {
	var html = document.getElementsByTagName('html')[0];

	html.className += html.className + ' dark';
	html.setAttribute('data-bs-theme', 'dark');
}

})();
