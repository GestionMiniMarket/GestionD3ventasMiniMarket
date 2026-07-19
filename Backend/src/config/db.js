const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.MYSQLHOST || '127.0.0.1',
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || '',
  database: process.env.MYSQLDATABASE || 'tu_base_local',
  port: process.env.MYSQLPORT || 3306
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado a MySQL');
});

module.exports = db;