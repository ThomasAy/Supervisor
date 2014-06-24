var snmp = require('net-snmp');
var event = require('events');

function SnmpDevice(ip)
{
    this.id = 2;
    this.ip = ip;
    this.name = undefined;
    this.mac = undefined;
    this.maxRAM = undefined;
    this.currentRAM = undefined;
    this.community = 'publicSup';

    this.eventEmitter = new event.EventEmitter();
    this.eventEmitter.on('getHostNameFromIP_completed', this.getHostNameFromIP_completed);
}

// private : blabla
SnmpDevice.prototype.setName = function (name) {
    this.name = name;
}

SnmpDevice.prototype.getName = function () {
    return this.name;
}

SnmpDevice.prototype.init = function () {
    this.getHostNameFromIP();
}

SnmpDevice.prototype.getHostNameFromIP_completed = function (e, self) {
    self.setName(e);
}

SnmpDevice.prototype.getHostNameFromIP = function () {
    //var oids = ['1.3.6.1.2.1.1.5.0', '1.3.6.1.2.1.1.6.0', '1.3.6.1.2.1.1.7.0', '1.3.6.1.2.1.1.2.0', '1.3.6.1.2.1.1.3.0', '1.3.6.1.2.1.2.1.0', '1.3.6.1.2.1.6.5.0', '1.3.6.1.2.1.6.9.0'];
    var oids = ['1.3.6.1.2.1.1.5.0'];
    var self = this;
    var session = snmp.createSession(this.ip, this.community);

    session.get(oids, function (err, varbinds) {
        if (err)
            console.log('Erreur' + err);
        else {
            for (var i = 0; i < varbinds.length; i++) {
                if (snmp.isVarbindError(varbinds[i]))
                    return null;
                else {
                    self.eventEmitter.emit('getHostNameFromIP_completed', varbinds[i].value.toString(), self);
                }
            }
        }
    });
}

/*var t = new SnmpDevice('192.168.0.140');

t.init();
console.log(t.getName());*/