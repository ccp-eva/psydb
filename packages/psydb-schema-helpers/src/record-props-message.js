'use strict';
var { Id, ExactObject } = require('@mpieva/psydb-schema-fields');

var createMessageType = require('./create-record-message-type'),
    Message = require('./message');

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

module.exports = RecordPropsMessage;
