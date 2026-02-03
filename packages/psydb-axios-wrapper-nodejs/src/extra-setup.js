'use strict';
var http = require('http'); // node:http

var createServer = (bag) => {
    var { fn } = bag;
    return http.createServer(fn);
}

var getServerURL = (server) => {
    if (!server.listening) {
        server.listen(0);
    }
    
    var { address, port } = server.address();
    if (address === '::') {
        address = '127.0.0.1'; // FIXME
    }
    
    var url = `http://${address}:${port}/`;
    return url;
}

module.exports = {
    createServer,
    getServerURL,
}
