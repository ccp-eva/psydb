'use strict';
var Driver = require('@mpieva/psydb-driver-nodejs');

var executeWithDriver = async (bag) => {
    var { url, script, apiKey, extraOptions, idgen } = bag;

    var driver = Driver({ target: url, apiKey });

    await script({
        driver,
        apiKey, // FIXME: deprecated; driver now stores it
        extraOptions,
        idgen,
    });
}

module.exports = executeWithDriver;
