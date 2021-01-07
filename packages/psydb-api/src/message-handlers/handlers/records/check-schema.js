'use strict';
var {
    createRecordMessageType,
    RecordIdOnlyMessage,
    RecordPropsMessage
} = require('@mpieva/psydb-schema-helpers');

var {
    createAllSchemas,
} = require('@mpieva/psydb-schema');

var Ajv = require('../../../lib/ajv');

var createSchema = async ({ recordSchemas, message }) => {
    var {
        collection,
        type,
        subtype
    } = message.payload;

    var recordSchema = recordSchemas.find({ collection, type, subtype });
    if (!recordSchema) {
        throw new ApiError(400, 'RecordSchemaNotFound');
    }

    console.log(recordSchema);

    var ajv = Ajv();

    var messageSchemas = (
        recordSchemas
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
            
            ...(
                it.schemas.gdpr
                ? [
                    createItem({
                        ...it, op: 'deleteGdpr',
                        createSchemaCallback: RecordIdOnlyMessage
                    })
                ]
                : []
            )

        ]), [])
    );

    return messageSchemas;
}

var createItem = ({
    createSchemaCallback, schemas, ...other
}) => ({
    messageType: createRecordMessageType(other),
    schema: createSchemaCallback({
        schemas, ...other
    }),
})

module.exports = createSchema;
