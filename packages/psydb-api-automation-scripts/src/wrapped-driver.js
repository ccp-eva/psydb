'use strict';
var Axios = require('axios');
var Driver = require('@mpieva/psydb-driver-nodejs');
var Cache = require('./cache');
var utils = require('./utils');

var WrappedDriver = (bag) => {
    var { agent, apiKey, url } = bag;
    
    if (!agent) {
        agent = Axios.create({
            baseURL: url
        })
    }

    var driver = Driver({ agent, apiKey });

    driver.crt = withDriver(driver, utils.crt);
    driver.helperSet = withDriver(driver, utils.helperSet);
    driver.systemRole = withDriver(driver, utils.systemRole);

    return driver;
}

var withDriver = (driver, obj) => {
    var out = {};
    for (var [key, fn] of Object.entries(obj)) {
        out[key] = (bag) => fn({ driver, ...bag })
    }

    return out;
}

module.exports = WrappedDriver;
