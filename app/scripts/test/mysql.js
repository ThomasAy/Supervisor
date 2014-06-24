var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '192.168.0.140',
  user     : 'remote',
  password : 'remote',
  database : 'syslogs'
});

connection.connect();

connection.query('SELECT distinct ip as n FROM syslogs', function(err, rows, fields) {
  if (err) throw err;

  for (var i = rows.length - 1; i >= 0; i--) {
  	app.$data.tab.push({message : rows[i].n});
  };
});

connection.end();

console.log('toto');