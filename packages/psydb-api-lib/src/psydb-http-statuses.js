'use strict';
var getVanillaStatus = require('statuses');

var extraStatuses = {
    // NOTE: when the server deletgates internally
    // i.e. to aother service we control
    '600': 'Internal Delegation Error',
    // NOTE: when the server deletgates externally
    // i.e. requesting a service we have no control over
    '700': 'External Delegation Error',
}

var getStatus = (code) => (
    code < 600
    ? getVanillaStatus(code)
    : extraStatuses[code]
);

module.exports = getStatus;
