'use strict';
var { promisify } = require('util');
var mysql = require('mysql');

var useMysql = () => {
    var conn = mysql.createConnection({
        host: '127.0.0.1',
        port: 33060,
        user: 'root',
        password: '',
        database: '',
    });
    
    var query = promisify(conn.query).bind(conn);

    return [ query, conn ];
}

module.exports = useMysql;
