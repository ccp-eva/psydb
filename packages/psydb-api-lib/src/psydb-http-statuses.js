'use strict';
var getVanillaStatus = require('statuses');

var extraStatuses = {
    // NOTE: when the server deletgates internally
    // i.e. to aother service we control
    '600': 'Internal Delegation Failed',
    // NOTE: when the server deletgates externally
    // i.e. requesting a service we have no control over
    '700': 'External Delegation Failed',

    // FIXME: not sure about this
    '801': 'Two Factor Auth Code Required',
    '803': 'Two Factor Auth Code Mismatch',
}

var getStatus = (code) => (
    code < 600
    ? getVanillaStatus(code)
    : extraStatuses[code]
);

module.exports = getStatus;
