Vue.component('multi', { template: vTemplate('partials/multi-devices.html') })
Vue.component('settings', { template: vTemplate('partials/settings.html') })
window.snmpDevices = {"0":{"name":"192.168.0.1","status":"disponnible","storage":20},"1":{"name":"192.168.0.25","status":"disponnible","storage":20},"2":{"name":"192.168.0.140","status":"disponnible","storage":20},"3":{"name":"192.168.0.161","status":"disponnible","storage":20},"4":{"name":"192.168.0.12","status":"disponnible","storage":20},"5":{"name":"127.0.0.1","status":"disponnible","storage":20}};

var app = new Vue({
    el: '#app',
    data: {
        currentView: 'multi',
        devices: window.snmpDevices
    }
})