'use strict';
var http = require('http'); // node:http
var Axios = require('axios');

var isFunction = (that) => {
    var type = Object.prototype.toString.call(that).slice(8, -1);
    return type === 'Function';
}

var createAgent = (app, options = {}) => {
    var server = (
        isFunction(app)
        ? http.createServer(app)
        : app
    );

    if (!server.listening) {
        server.listen(0);
    }
    
    var { address, port } = server.address();
    if (address === '::') {
        address = '127.0.0.1'; // FIXME
    }
    var axios = Axios.create({
        baseURL: `http://${address}:${port}/`
    });

    // NOTE: thats ghetto
    axios.close = () => {
        return server.close();
    }

    return axios;
}

module.exports = createAgent;
