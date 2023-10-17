'use strict';
var http = require('http'); // node:http
var Axios = require('axios');

var { wrapper: addCookieSupport } = require('axios-cookiejar-support');
var { CookieJar } = require('tough-cookie');

var createAgent = (app, options = {}) => {
    var {
        enableCookies = false,
    } = options;

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

    var bag = {
        baseURL: `http://${address}:${port}/`
    };
    var axios = (
        enableCookies
        ? createWithCookieSupport(bag)
        : createDefault(bag)
    )

    // NOTE: thats ghetto
    axios.close = () => {
        return server.close();
    }

    return axios;
}

var createWithCookieSupport = (bag) => {
    var jar = new CookieJar();
    var axios = addCookieSupport(Axios.create({ ...bag, jar }));

    return axios;
}

var createDefault = (bag) => {
    var axios = Axios.create(bag);
    return axios;
}

var isFunction = (that) => {
    var type = Object.prototype.toString.call(that).slice(8, -1);
    return type === 'Function';
}

module.exports = createAgent;
