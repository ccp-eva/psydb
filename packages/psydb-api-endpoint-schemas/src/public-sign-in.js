'use strict';
var {
    ExactObject,
    Email,
    Password,
} = require('@mpieva/psydb-schema-fields');

module.exports = {
    RequestBody: () => ExactObject({
        properties: {
            email: Email(),
            password: Password()
        },
        required: [
            'email',
            'password',
        ]
    })
};
