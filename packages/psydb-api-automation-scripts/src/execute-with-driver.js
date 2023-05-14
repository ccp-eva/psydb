'use strict';
var Driver = require('@mpieva/psydb-driver-nodejs');

var executeWithDriver = async (bag) => {
    var {
        url,
        apiKey,
        script,
        agent = undefined,
        
        extraOptions,
    } = bag;

    if (!agent) {
        agent = Axios.createAgent({
            baseURL: url
        })
    }

    var driver = Driver({ agent });
    await script({ driver, apiKey, extraOptions });
}

module.exports = executeWithDriver;
