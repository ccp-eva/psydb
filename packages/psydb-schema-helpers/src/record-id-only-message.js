'use strict';
var { Id, ExactObject } = require('@mpieva/psydb-schema-fields');

var createMessageType = require('./create-record-message-type'),
    Message = require('./message');

var RecordIdOnlyMessage = ({
    collection,
    type,
    subtype,
    op,
}) => Message({
    type: createMessageType({ collection, op }),
    payload: ExactObject({
        properties: {
            id: Id(),
        }
    })
})

module.exports = RecordIdOnlyMessage;
