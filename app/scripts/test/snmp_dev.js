var events = require('events');
var snmp = require('net-snmp');

var target = '192.168.0.161';
var community = 'publicSup';
//var oids = ['1.3.6.1.2.1.1.5.0', '1.3.6.1.2.1.1.6.0','1.3.6.1.2.1.1.7.0','1.3.6.1.2.1.1.2.0', '1.3.6.1.2.1.1.3.0', '1.3.6.1.2.1.2.1.0', '1.3.6.1.2.1.6.5.0', '1.3.6.1.2.1.6.9.0'];
//var oids = ['1.3.6.1.2.1.25.2.2.0']; // RAM
var oids = ['1.3.6.1.2.1.1.5.0'];
    
var session = snmp.createSession(target, community);
var hostname;



var oid = "1.3.6.1.4.1.77.1.2.25.1.1.6";

function doneCb (error) {
    if (error)
        console.error (error.toString ());
}

function feedCb (varbinds) {
    for (var i = 0; i < varbinds.length; i++) {
        if (snmp.isVarbindError (varbinds[i]))
            console.error (snmp.varbindError (varbinds[i]));
        else
            console.log (varbinds[i].oid + "|" + varbinds[i].value);
    }
}

var maxRepetitions = 1;

// The maxRepetitions argument is optional, and will be ignored unless using
// SNMP verison 2c
session.walk (oid, maxRepetitions, feedCb, doneCb);