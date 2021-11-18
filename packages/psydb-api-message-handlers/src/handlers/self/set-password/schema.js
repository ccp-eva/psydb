'use strict';
var {
    ExactObject,
    ForeignId,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({ messageType } = {}) => {
    return Message({
        type: messageType,
        payload: ExactObject({
            properties: {
                currentPassword: { type: 'string' },
                newPassword: {
                    type: 'string',
                    minLength: 8
                }
            },
            required: [
                'currentPassword',
                'newPassword',
            ]
        })
    });
}

module.exports = createSchema;
