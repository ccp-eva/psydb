'use strict';
var createMessageType = require('./create-record-message-type'),
    RecordIdOnlyMessage = require('./record-id-only-message'),
    RecordPropsMessage = require('./record-props-message');

var createCollectionMessages = ({
    collectionSchemas
}) => {

    var messageSchemas = (
        collectionSchemas
        .reduce((acc, it) => ([
            ...acc,
            createItem({
                ...it, op: 'create',
                createSchemaCallback: RecordPropsMessage
            }),
            
            createItem({
                ...it, op: 'patch',
                createSchemaCallback: (opts) => (
                    RecordPropsMessage({ ...opts, requiresId: true })
                )
            }),
            
            ...(it.schemas.gdpr ? [
                createItem({
                    ...it, op: 'deleteGdpr',
                    createSchemaCallback: RecordIdOnlyMessage
                })
            ] : [])

        ]), [])
    );

    return messageSchemas;
}

var createItem = ({
    createSchemaCallback, schemas, ...other
}) => ({
    messageType: createMessageType(other),
    schema: createSchemaCallback({
        schemas, ...other
    }),
})

module.exports = createCollectionMessages;
