function vTemplate(url){
	if (typeof window.toto != 'object') window.toto = {};
	if (!window.toto[url]) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if (4 != xhr.readyState ) return;
			if (0 == xhr.status) {

			}
			window.toto[url] = xhr.responseText;
		}
		xhr.open('GET', url, false);
		xhr.send();
	}
	return window.toto[url];
}

var app = new Vue({
	el: '#view',
	template: vTemplate('template.html'),
	data: {
		tab: [
				
			]
	}
})