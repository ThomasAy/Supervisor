var snmp = require('net-snmp');

var target = '127.0.0.1';
var community = 'public';
var oids = ['1.3.6.1.2.1.1.5.0', '1.3.6.1.2.1.1.6.0'];

var session = snmp.createSession(target, community);

session.get(oids, function (err, varbinds) {
    if (err) {
        console.error(err);
    } else {
        for (var i = 0; i < varbinds.length; i++)
        {     
            if (snmp.isVarbindError(varbinds[i]))
                console.error(snmp.varbindError(varbinds[i]));
            else
                console.log(varbinds[i].oid + " = " + varbinds[i].value);         
        }
    }
});

session.trap(snmp.TrapType.LinkDown, function (error) {
    if (error)
        console.error(error);
});