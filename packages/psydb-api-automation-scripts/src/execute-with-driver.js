'use strict';
var Axios = require('axios');
var Driver = require('@mpieva/psydb-driver-nodejs');

var executeWithDriver = async (bag) => {
    var {
        url,
        script,
        apiKey,
        agent = undefined,
        
        extraOptions,
    } = bag;

    if (!agent) {
        agent = Axios.create({
            baseURL: url
        })
    }

    var driver = Driver({ agent });
    await script({ driver, apiKey, extraOptions });
}

module.exports = executeWithDriver;
