'use strict';
var {
    Id
} = require('@mpieva/psydb-schema-fields');

var MessageSchema = require('@mpieva/psydb-schema-helpers').Message,
    messageType = require('./message-type');

var createSchema = ({ recordSchemas }) => (
    MessageSchema({
        type: messageType,
        payload: {
            id: Id(),
            password: {
                type: 'string',
                minLength: 8
            }
        }
    })
);

module.exports = createSchema;
