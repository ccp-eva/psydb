'use strict';
var {
    Id,
    EventId
} = require('@mpieva/psydb-schema-fields');

var MessageSchema = require('@mpieva/psydb-schema-helpers').Message,
    messageType = require('./message-type');

var checkSchema = ({ recordSchemas, message }) => {
    var schema = MessageSchema({
        type: messageType,
        payload: {
            id: Id(),
            lastKnownEventId: EventId(),
            password: {
                type: 'string',
                minLength: 8
            }
        }
    });
};

module.exports = checkSchema;
