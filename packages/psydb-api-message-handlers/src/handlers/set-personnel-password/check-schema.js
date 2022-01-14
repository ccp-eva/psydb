'use strict';
var {
    ExactObject,
    Id,
    EventId,
    StringConst,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var MessageSchema = require('@mpieva/psydb-schema-helpers').Message,
    messageType = require('./message-type');

var checkSchema = ({ recordSchemas, message }) => {
    var schema = MessageSchema({
        type: messageType,
        payload: { oneOf: [
            ExactObject({
                properties: {
                    id: Id(),
                    lastKnownEventId: EventId(),
                    method: StringConst({ value: 'auto' }),
                },
                required: [ 'id', 'lastKnownEventId', 'method' ]
            }),
            ExactObject({
                properties: {
                    id: Id(),
                    lastKnownEventId: EventId(),
                    method: StringConst({ value: 'manual' }),
                    password: {
                        type: 'string',
                        minLength: 8
                    },
                    sendMail: DefaultBool()
                },
                required: [
                    'id', 'lastKnownEventId', 'method',
                    'password', 'sendMail'
                ]
            }),
        ]}
    });
};

module.exports = checkSchema;
