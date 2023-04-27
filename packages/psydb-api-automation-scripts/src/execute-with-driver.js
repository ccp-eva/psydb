'use strict';
var Driver = require('@mpieva/psydb-driver-nodejs');

var executeWithDriver = async (bag) => {
    var {
        url,
        script,
        agent = undefined,
    } = bag;

    if (!agent) {
        agent = Axios.createAgent({
            baseURL: url
        })
    }

    var driver = Driver({ agent });
    await script({ driver });
}

module.exports = executeWithDriver;
