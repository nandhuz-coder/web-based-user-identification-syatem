const mysql = require('mysql');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    database: 'web_based'
});

module.exports = connection;