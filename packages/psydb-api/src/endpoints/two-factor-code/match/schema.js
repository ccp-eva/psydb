'use strict';
var {
    ExactObject,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

module.exports = () => ExactObject({
    properties: {
        twoFactorCode: SaneString(),
        timezone: { type: 'string' }
    },
    required: [
        'twoFactorCode',
    ]
})
