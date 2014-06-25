Vue.component('multi', { template: vTemplate('partials/multi-devices.html') })
Vue.component('settings', { template: vTemplate('partials/settings.html') })
window.snmpDevices = {};

var app = new Vue({
    el: '#app',
    data: {
        currentView: 'multi',
        devices: window.snmpDevices
    }
})