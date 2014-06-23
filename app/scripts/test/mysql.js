var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'portefeuille_de_competences'
});

connection.connect();

connection.query('SELECT * FROM projet', function(err, rows, fields) {
  if (err) throw err;

  for (var i = rows.length - 1; i >= 0; i--) {
  	console.log(rows[i].titre);
  };
});

connection.end();

console.log('toto');