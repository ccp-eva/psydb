'use strict';
var {
    ExactObject,
    IdentifierString,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');
var parseMessageType = require('./parse-message-type');

var createSchema = ({ message }) => {
    var { op } = parseMessageType(messageType);
    return Message({
        type: `helper-sets/${op}`,
        payload: ExactObject({
            properties: {
                id: IdentifierString(),
                label: SaneString(),
            },
            required: [
                'id',
                'label'
            ]
        })
    });
}

module.exports = createSchema;
