'use strict';
var createWebAgent = require('@mpieva/psydb-axios-wrapper-web');

var { isFunction, isString } = require('./utils');
var { createServer, getServerURL } = require('./extra-setup');

var createAgent = (target, options = {}) => {
    var { ...pass } = options;

    var server, baseURL;
    if (isFunction(target)) {
        server = createServer({ fn: target });
        baseURL = getServerURL(server);
    }
    else if (isString(target)) {
        baseURL = target;
    }
    else {
        server = target;
        baseURL = getServerAddress(server);
    }

    var axios = createWebAgent(baseURL, pass);
    
    // NOTE: thats ghetto
    axios.close = () => {
        return server?.close();
    }

    return axios;
}

module.exports = createAgent;
