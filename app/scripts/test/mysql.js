var mysql      = require('mysql');
var connection;


function connect(){
  connection = mysql.createConnection({
    host     : '192.168.0.136',
    user     : 'remote',
    password : 'remote',
    database : 'syslogs'
  });
  try {  
    connection.connect();
  }
  catch(err) {
    console.log("Error " + err)
  }
  console.log("connected");
}

function disconnect(){
  connection.end();
  console.log("disconnected")
}

function initInfos(){
  connect();

  connection.query('SELECT distinct ip as n FROM syslogs', function(err, rows, fields) {
    if (err) throw err;
    for (var i = rows.length - 1; i >= 0; i--) {
      var obj = new SnmpDevice(rows[i].n);
      obj.init();
      window.snmpDevices.$add(obj.id.toString(), obj);
    };
  });
  disconnect();
}

function updateInfos(){
  for(key in window.snmpDevices)
  {
    window.snmpDevices[key].init();
  }
}

function getLogFromIp(ip){
   connect();

   console.log('SELECT collected, facility, severity, message FROM syslogs where ip ="' + ip + '" order by collected desc limit 100');
  connection.query('SELECT date_format(collected, "%Y-%m-%d %H:%k:%s") as collected, facility, severity, message FROM syslogs where ip ="' + ip + '" order by collected desc limit 100', function(err, rows, fields) {
    if (err) throw err;
    for (var i = rows.length - 1; i >= 0; i--) {
      //console.log(rows[i]);
      window.syslogs.push(rows[i]);
      //window.syslogs.push({collected : rows[i].collected, facility : rows[i]})
    };
  });
  disconnect();
}

