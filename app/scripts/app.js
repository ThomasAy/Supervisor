Vue.component('multi', { template: vTemplate('partials/multi-devices.html') })
Vue.component('settings', { template: vTemplate('partials/settings.html') })
Vue.component('fiche', { template: vTemplate('partials/device.html') })
window.snmpDevices = {};

var app = new Vue({
	el: '#app',
	data: {
		currentView: 'multi',
		devices: window.snmpDevices,
		deviceId: -1
	},
	computed: {
		device: function() {
			if (this.deviceId >= 0) {
				return this.devices[this.deviceId];
			} else {
				return null;	
			}

		}
	},
	created: function(){initInfos()}
})