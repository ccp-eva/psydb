'use strict';
var {
    ExactObject,
    Email,
    Password,
} = require('@mpieva/psydb-schema-fields');

module.exports = () => ExactObject({
    properties: {
        email: Email({ format: 'email' }), // FIXME:  format
        password: Password(),
        timezone: { type: 'string' }
    },
    required: [
        'email',
        'password',
    ]
})
