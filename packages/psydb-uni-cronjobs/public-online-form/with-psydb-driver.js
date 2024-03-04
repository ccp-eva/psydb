'use strict';
var Axios = require('axios');
var Driver = require('@mpieva/psydb-driver-nodejs');

var withPsydbDriver = (cliOptions) => async (context, next) => {
    var { psydbApiKey, psydbUrl, psydbVerbose } = cliOptions;

    var agent = Axios.create({
        baseURL: psydbUrl
    });

    var driver = Driver({ agent, apiKey: psydbApiKey });

    context.driver = driver;
    await next();
}

module.exports = withPsydbDriver;
