var events = require('events');
var snmp = require('net-snmp');

var target = '192.168.0.140';
var community = 'publicSup';
//var oids = ['1.3.6.1.2.1.1.5.0', '1.3.6.1.2.1.1.6.0','1.3.6.1.2.1.1.7.0','1.3.6.1.2.1.1.2.0', '1.3.6.1.2.1.1.3.0', '1.3.6.1.2.1.2.1.0', '1.3.6.1.2.1.6.5.0', '1.3.6.1.2.1.6.9.0'];
//var oids = ['1.3.6.1.2.1.25.2.2.0']; // RAM
var oids = ['1.3.6.1.2.1.1.5.0'];
    
var session = snmp.createSession(target, community);
var hostname;

function getNameFromIp(ip) {

    var session = snmp.createSession(ip, community)
    // oid nom de la machine
    var oids = ['1.3.6.1.2.1.1.5.0'];

    session.get(oids, function (err, varbinds) {
        if (err) {
            console.error(err);
        } else {
            for (var i = 0; i < varbinds.length; i++) {
                if (snmp.isVarbindError(varbinds[i]))
                    return null;
                else
                    console.log(varbinds[i].value);
            }
        }
    });
}

console.log(getNameFromIp('192.168.0.161'));