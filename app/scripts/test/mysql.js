var mysql      = require('mysql');
var connection;



function connect(){
  connection = mysql.createConnection({
    host     : '192.168.0.140',
    user     : 'remote',
    password : 'remote',
    database : 'syslogs'
  });
  connection.connect();
  console.log("connected");
}

function disconnect(){
  connection.end();
  console.log("disconnected")
}

function updateInfos(){
  connect();

  connection.query('SELECT distinct ip as n FROM syslogs', function(err, rows, fields) {
    if (err) throw err;

    for (var i = rows.length - 1; i >= 0; i--) {
      var obj = new SnmpDevice(rows[i].n);
      obj.init();

      window.snmpDevices.$add(i.toString(), obj);
    };
  });
  disconnect();
}

