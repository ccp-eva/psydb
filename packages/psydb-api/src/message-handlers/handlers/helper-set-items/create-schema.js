'use strict';
var {
    ExactObject,
    IdentifierString,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');
var parseMessageType = require('./parse-message-type');

var createSchema = ({ messageType }) => {
    var { op, set } = parseMessageType(messageType);
    return Message({
        type: `helper-set-items/${op}/${set}`,
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
