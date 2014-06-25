var snmp = require('net-snmp');
var event = require('events');

// public : Constructeur
function SnmpDevice(ip)
{
    this.id = window.snmpDevice_id;
    window.snmpDevice_id += 1;
    this.ip = ip;
    this.name = undefined;
    this.mac = undefined;
    this.maxRAM = undefined;
    this.currentRAM = undefined;
    this.community = 'publicSup';

    this.eventEmitter = new event.EventEmitter();
    this.eventEmitter.on('getHostNameFromIP_completed', this.getHostNameFromIP_completed);
    this.eventEmitter.on('getMaxRAM_completed', this.getMaxRAM_completed);
}

// private : set le nom de la machine
SnmpDevice.prototype.setName = function (name) {
    this.name = name;
}

// public : récupère le nom de la machine
SnmpDevice.prototype.getName = function () {
    return this.name;
}

// private : set la RAM max
SnmpDevice.prototype.setMaxRAM = function (ram) {
    this.maxRAM = ram;
}

// public : récupère la valeur RAM max
SnmpDevice.prototype.getMaxRAM = function () {
    return Number(this.convertKbyteToGByte(this.maxRAM).toFixed(3));
}

SnmpDevice.prototype.convertKbyteToGByte = function (value) {
    return value / (1024 * 1024);
}

// public : initialise les informations sur l'objet
SnmpDevice.prototype.init = function () {
    this.getHostNameByOid();
    this.getMaxRAMByOid();
}

// private : permet de récupérer la valeur de l'oid pour le device en cours
SnmpDevice.prototype.getInfoFromOids = function (oids, eventName) {
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
                    self.eventEmitter.emit(eventName, varbinds[i].value.toString(), self);
                }
            }
        }
    });

}

// private : événement de retour pour la récupération du nom d'hôte
SnmpDevice.prototype.getHostNameFromIP_completed = function (e, self) {
    self.setName(e);
}

// public : récupérer le nom d'hôte
SnmpDevice.prototype.getHostNameByOid = function () {
    //var oids = ['1.3.6.1.2.1.1.5.0', '1.3.6.1.2.1.1.6.0', '1.3.6.1.2.1.1.7.0', '1.3.6.1.2.1.1.2.0', '1.3.6.1.2.1.1.3.0', '1.3.6.1.2.1.2.1.0', '1.3.6.1.2.1.6.5.0', '1.3.6.1.2.1.6.9.0'];
    var oids = ['1.3.6.1.2.1.1.5.0'];

    this.getInfoFromOids(oids, 'getHostNameFromIP_completed');
}

// private : événement de retour pour la récupération de la RAM max
SnmpDevice.prototype.getMaxRAM_completed = function (e, self) {
    self.setMaxRAM(e);
}

// public  : récupérer la RAM max de l'hôte
SnmpDevice.prototype.getMaxRAMByOid = function () {
    var oids = ['1.3.6.1.2.1.25.2.2.0'];
    this.getInfoFromOids(oids, 'getMaxRAM_completed');
}

/*********************************/
/***********Demo & Test***********/
/*********************************/

//*
var t = new SnmpDevice('192.168.0.140');

t.init();
console.log(t.id);


var t2 = new SnmpDevice('192.168.0.140');

t2.init();
console.log(t2.id);
//*/