window.snmpDevices = {};
window.syslogs = [];

var gui = require('nw.gui');
var win = gui.Window.get();

document.getElementById('close').addEventListener('click', function(){
	debugger;
	win.close();
}, false)

document.getElementById('mini').addEventListener('click', function(){
	win.minimize();
}, false)

Vue.component('multi', { template: vTemplate('partials/multi-devices.html') })
Vue.component('settings', { template: vTemplate('partials/settings.html') })
Vue.component('fiche', { template: vTemplate('partials/device.html') })

var app = new Vue({
	el: '#app',
	data: {
		currentView: 'multi',
		devices: window.snmpDevices,
		deviceId: -1,
		logs: window.syslogs
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
    methods: {
        freeStorage: function(device) {
            var free = 0;
            for (var i = device.mountedDisks.length - 1; i >= 0; i--) {
                free += device.mountedDisks[i].getDiskFree();
            };
            return device.mountedDisks.length > 0 ? Math.round(free) : null;
        },
        freeStorageMessage: function(device) {
            var free = this.freeStorage(device);
            return free == null ? 'non disponnible' : free + 'Go disponnible';
        }
    },
	created: function(){initInfos()}
})