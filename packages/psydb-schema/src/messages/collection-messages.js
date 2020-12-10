'use strict';
var createCollectionMessages = ({
    collectionSchemas
}) => {

    var createItem = ({
        collection, type, subtype, schemas,
        op, createSchemaCallback
    }) => ({
        messageType: createMessageType({ collection, op }),
        schema: createSchemaCallback({
            collection, type, subtype, schemas, op
        }),
    })

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
                    createSchemaCallback: DeleteGdprMessage
                })
            ] : [])

        ]), [])
    );

    return messageSchemas;
}

var createMessageType = ({ op, collection, type, subtype }) => {
    return [
        `/records/${op}/${collection}`,
        ...(type ? [type] : []),
        ...(subtype ? [subtype] : []),
    ].join('/');
};

var { Id, ExactObject } = require('@mpieva/psydb-schema-fields');
var Message = require('./message');

var RecordPropsMessage = ({
    collection,
    type,
    subtype,
    schemas,
    op,
    requiresId
}) => {
    return Message({
        type: createMessageType({ collection, op }),
        payload: ExactObject({
            properties: {
                id: Id(),
                ...(type && { type: { const: type }}),
                ...(subtype && { subtype: { const: subtype }}),
                
                ...(schemas.state && { props: schemas.state }),
                ...(schemas.scientific && { props: ExactObject({
                    properties: {
                        scientific: schemas.scientific,
                        ...(schemas.gdpr && { gdpr: schemas.gdpr }),
                    },
                    required: [
                        'scientific',
                        ...(schemas.gdpr ? [ 'gdpr' ] : [])
                    ]
                })})
            },
            required: [
                ...(requiresId ? ['id'] : []),
                ...(type ? ['type'] : []),
                ...(subtype ? ['subtype'] : []),
                'props',
            ]
        })
    })
};

var DeleteGdprMessage = ({
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

module.exports = createCollectionMessages;
