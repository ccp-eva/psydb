'use strict';
var createCollectionMessages = ({
    collectionSchemas
}) => {

    console.log('#####################');
    console.log(collectionSchemas);

    var messageSchemas = (
        collectionSchemas
        .reduce((acc, it) => ([
            ...acc,
            {
                messageType: createMessageType({
                    collection: it.collection,
                    op: 'create'
                }),
                schema: CreateSchema(it),
            },
        ]), [])
    )

    console.log('#####################');
    return messageSchemas;
}

var createMessageType = ({ collection, op }) => (
    `/collection/${collection}/${op}`
);

var { Id } = require('@mpieva/psydb-schema-fields');

var CreateSchema = ({ collection, type, subtype, schemas }) => (
    Message({
        type: createMessageType({ collection, op: 'create' }),
        payload: {
            type: 'object',
            additionalProperties: false,
            properties: {
                id: Id(),
                ...(type && { type: { const: type }}),
                ...(subtype && { subtype: { const: subtype }}),
                props: schemas.state,
            },
            required: [
                ...(type ? ['type'] : []),
                ...(subtype ? ['subtype'] : []),
                'props',
            ]
        }
    })
);

var Message = ({ type, payload }) => ({
    type: 'object',
    additionalProperties: false,
    properties: {
        type,
        payload,
    },
    required: [
        'type',
        'payload',
    ],
});

module.exports = createCollectionMessages;
