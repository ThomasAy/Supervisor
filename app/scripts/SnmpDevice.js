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
    this.infoMountedDiskNumber = 0;
    this.mountedDisks = [];
    this.upTime = undefined;
    this.location = undefined;
    this.workgroup = undefined;

    this.getMountedDisksNumber = function() {
            return this.mountedDisks.length;
    }

    this.eventEmitter = new event.EventEmitter();

    this.eventEmitter.on('getHostNameFromIP_completed', function (e, self) {
        self.setName(e);
    });

    this.eventEmitter.on('getMaxRAM_completed', function (e, self) {
        self.setMaxRAM(e);
    });

    this.eventEmitter.on('getUpTime_completed', function (e, self) {
        self.upTime = e;
    });

    this.eventEmitter.on('getLocation_completed', function (e, self) {
        self.location = e;
    });

    this.eventEmitter.on('getWorkgroupByOid_completed', function (e, self) {
        self.workgroup = e;
    });

    this.eventEmitter.on('getMountedDiskByOid_completed', function (e, self) {
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

    this.eventEmitter.on('getBlockSizeFromOid_completed', function (e, self, rankInArray) {
        self.mountedDisks[rankInArray].blockSize = e;
    });

    this.eventEmitter.on('getStorageSizeFromOid_completed', function (e, self, rankInArray) {
        self.mountedDisks[rankInArray].storageSize = e;
    });

    this.eventEmitter.on('getStorageUsedFromOid_completed', function (e, self, rankInArray) {
        self.mountedDisks[rankInArray].storageUsed = e;
    });
    
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
    }

    // private : permet de récupérer la valeur de l'oid pour le device en cours
    this.getInfoFromOids = function (oids, eventName) {
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
                        self.eventEmitter.emit(eventName, varbinds[i].value.toString(), self, disk);
                    }
                }
            }
        });
    }

    // public : récupérer le nom d'hôte
    this.getHostNameByOid = function () {
        //var oids = ['1.3.6.1.2.1.1.5.0', '1.3.6.1.2.1.1.6.0', '1.3.6.1.2.1.1.7.0', '1.3.6.1.2.1.1.2.0', '1.3.6.1.2.1.1.3.0', '1.3.6.1.2.1.2.1.0', '1.3.6.1.2.1.6.5.0', '1.3.6.1.2.1.6.9.0'];
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