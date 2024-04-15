'use strict';
var Driver = require('./wrapped-driver');

var executeWithDriver = async (bag) => {
    var {
        url,
        script,
        apiKey,
        agent = undefined,
        
        extraOptions,
    } = bag;

    var driver = Driver({ agent, apiKey, url });
    await script({ driver, apiKey, extraOptions });
}

module.exports = executeWithDriver;
