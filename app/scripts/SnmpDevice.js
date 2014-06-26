var snmp = require('net-snmp');
var event = require('events');

var eventEmitter = new event.EventEmitter();

eventEmitter.on('getHostNameFromIP_completed', function (e, self) {
    self.setName(e);
});

eventEmitter.on('getMaxRAM_completed', function (e, self) {
    self.setMaxRAM(e);
});

eventEmitter.on('getUpTime_completed', function (e, self) {
    self.upTime = e;
});

eventEmitter.on('getLocation_completed', function (e, self) {
    self.location = e;
});

eventEmitter.on('getWorkgroupByOid_completed', function (e, self) {
    self.workgroup = e;
});

eventEmitter.on('getMountedDiskByOid_completed', function (e, self) {
    if (e.split(" ").length > 3) {
        var disk = new MountedDisk(e);
        self.mountedDisks.push(disk);
        console.log(self.mountedDisks.length);
        self.getBlockSizeFromOid(self.infoMountedDiskNumber + 1, self.mountedDisks.length - 1);
        self.getStorageSizeFromOid(self.infoMountedDiskNumber + 1, self.mountedDisks.length - 1);
        self.getStorageUsedFromOid(self.infoMountedDiskNumber + 1, self.mountedDisks.length - 1);
    }
    self.infoMountedDiskNumber++;
    self.getMountedDiskByOid();
});

eventEmitter.on('feedCb_event', function feedCb(e, self) {
    self.sessionInfos.push(e.toString());
});

eventEmitter.on('getBlockSizeFromOid_completed', function (e, self, rankInArray) {
    self.mountedDisks[rankInArray].blockSize = e;
});

eventEmitter.on('getStorageSizeFromOid_completed', function (e, self, rankInArray) {
    self.mountedDisks[rankInArray].storageSize = e;
});

eventEmitter.on('getStorageUsedFromOid_completed', function (e, self, rankInArray) {
    self.mountedDisks[rankInArray].storageUsed = e;
});
 
eventEmitter.on('getSoftByOid_completed', function (e, self) {
    var program = new Program(e);
    self.softInstalled.push(program);
    self.nbSoft++;
    self.getSoftByOid();
});

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
    this.infoMountedDiskNumber = 0;
    this.mountedDisks = [];
    this.nbSoft = 0;
    this.softInstalled = [];
    this.upTime = undefined;
    this.location = undefined;
    this.workgroup = undefined;
    this.sessionInfos = [];

    this.getUserName = function () {
        return this.sessionInfos[0];
    };

    this.getMountedDisksNumber = function() {
            return this.mountedDisks.length;
    }

    // private : set le nom de la machine
    this.setName = function (name) {
        this.name = name;
    }

    // public : récupère le nom de la machine
    this.getName = function () {
        return this.name;
    }

    // private : set la RAM max
    this.setMaxRAM = function (ram) {
        this.maxRAM = ram;
    }

    // public : récupère la valeur RAM max
    this.getMaxRAM = function () {
        return Number(this.convertKbyteToGByte(this.maxRAM).toFixed(3));
    }

    this.convertKbyteToGByte = function (value) {
        return value / (1024 * 1024);
    }

    // public : initialise les informations sur l'objet
    this.init = function () {
        this.getHostNameByOid();
        this.getMaxRAMByOid();
        this.getMountedDiskByOid();
        this.getUpTimeByOid();
        this.getLocationByOid();
        this.getWorkgroupByOid();
        this.getSoftByOid();
        this.walkUsersFromOid();
    }

    // private : permet de récupérer la valeur de l'oid pour le device en cours
    this.getInfoFromOids = function (oids, eventName) {
        var self = this;
        var session = snmp.createSession(this.ip, this.community);

        session.get(oids, function (err, varbinds) {
            if (err)
                console.log('Erreur ' + err);
            else {
                for (var i = 0; i < varbinds.length; i++) {
                    if (snmp.isVarbindError(varbinds[i]))
                        return null;
                    else {
                        eventEmitter.emit(eventName, varbinds[i].value.toString(), self);
                    }
                }
            }
        });
    }

    // private : permet de récupérer la valeur de l'oid pour le device en cours et linker à une instance de disk
    this.getInfoDiskFromOids = function (oids, eventName, disk) {
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
                        eventEmitter.emit(eventName, varbinds[i].value.toString(), self, disk);
                    }
                }
            }
        });
    }

    // public : récupérer le nom d'hôte
    this.getHostNameByOid = function () {
        var oids = ['1.3.6.1.2.1.1.5.0'];
        this.getInfoFromOids(oids, 'getHostNameFromIP_completed');
    }

    // public  : récupérer la RAM max de l'hôte
    this.getMaxRAMByOid = function () {
        var oids = ['1.3.6.1.2.1.25.2.2.0'];
        this.getInfoFromOids(oids, 'getMaxRAM_completed');
    }

    this.getUpTimeByOid = function () {
        var oids = ['1.3.6.1.2.1.25.1.1.0'];
        this.getInfoFromOids(oids, 'getUpTime_completed');
    }

    this.getLocationByOid = function () {
        var oids = ['1.3.6.1.2.1.1.6.0'];
        this.getInfoFromOids(oids, 'getLocation_completed');
    }

    this.getWorkgroupByOid = function () {
        var oids = ["1.3.6.1.4.1.77.1.4.1.0"];
        this.getInfoFromOids(oids, 'getWorkgroupByOid_completed');
    }

    // public : permet de démarrer la récupération des disques montés sur le device
    this.getMountedDiskByOid = function () {
        var base_oids = "1.3.6.1.2.1.25.2.3.1.3." + (this.infoMountedDiskNumber + 1);
        var oids = [];
        oids.push(base_oids);
        this.getInfoFromOids(oids, 'getMountedDiskByOid_completed');
    }

    this.getSoftByOid = function () {
        var base_oids = "1.3.6.1.2.1.25.6.3.1.2." + (this.nbSoft + 1);
        var oids = [];
        oids.push(base_oids);
        this.getInfoFromOids(oids, 'getSoftByOid_completed');

    }

    // public
    this.getBlockSizeFromOid = function (rank, rankInArray) {
        var base_oids = "1.3.6.1.2.1.25.2.3.1.4." + rank;
        var oids = [];
        oids.push(base_oids);
        this.getInfoDiskFromOids(oids, 'getBlockSizeFromOid_completed', rankInArray);
    }

    this.getStorageSizeFromOid = function (rank, rankInArray) {
        var base_oids = "1.3.6.1.2.1.25.2.3.1.5." + rank;
        var oids = [];
        oids.push(base_oids);
        this.getInfoDiskFromOids(oids, 'getStorageSizeFromOid_completed', rankInArray);
    }

    this.getStorageUsedFromOid = function (rank, rankInArray) {
        var base_oids = "1.3.6.1.2.1.25.2.3.1.6." + rank;
        var oids = [];
        oids.push(base_oids);
        this.getInfoDiskFromOids(oids, 'getStorageUsedFromOid_completed', rankInArray);
    }

    this.walkUsersFromOid = function () {
        // 1.3.6.1.4.1.77.1.2.25.1.1.6.74.117.108.105.101.110
        // 1.3.6.1.4.1.77.1.2.25.1.1.6.77.97.120.105.109.101
        var self = this;
        var oid = "1.3.6.1.4.1.77.1.2.25.1.1.6";
        var session = snmp.createSession(this.ip, this.community);

        var maxRepetitions = 1;

        session.walk(oid, maxRepetitions,
            function feedCb(varbinds) {
                for (var i = 0; i < varbinds.length; i++) {
                    if (snmp.isVarbindError(varbinds[i]))
                        console.error(snmp.varbindError(varbinds[i]));
                    else
                        eventEmitter.emit('feedCb_event', varbinds[i].value, self);
                } 
            }
            ,
            function doneCb(error) {
                if (error)
                    console.error(error.toString());
            });
    }
}

/*********************************/
/***********Demo & Test***********/
/*********************************/

//*
var t = new SnmpDevice('192.168.0.161');
t.init();

var max = new SnmpDevice('192.168.0.136');
max.init();
//*/