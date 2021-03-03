'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var {
    createRecordMessageType,
    RecordIdOnlyMessage,
    RecordPropsMessage
} = require('@mpieva/psydb-schema-helpers');

var parseRecordMessageType = require('./parse-record-message-type');

var {
    createAllSchemas,
} = require('@mpieva/psydb-schema');

var ApiError = require('../../lib/api-error'),
    Ajv = require('../../lib/ajv');

var metas = require('@mpieva/psydb-schema').collectionMetadata;

var createSchema = async ({ getRecordSchemas, message }) => {
    var { 
        op, collection, 
        recordType, recordSubType 
    } = parseRecordMessageType(message.type);

    var recordSchemas = await getRecordSchemas();
    //console.log(recordSchemas);

    var recordSchema = recordSchemas.find({
        collection,
        type: recordType,
        subtype: recordSubType
    });

    if (!recordSchema) {
        throw new ApiError(400, 'RecordSchemaNotFound');
    }

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

    var keyedMessageSchemas = {};
    for (var it of messageSchemas) {
        keyedMessageSchemas[it.messageType] = it.schema;
    }

    console.dir(messageSchemas, { depth: null });

    var isValid = ajv.validate(
        keyedMessageSchemas[message.type],
        message
    )
    if (!isValid) {
        debug('ajv errors', message.type, ajv.errors);
        throw new ApiError(400, 'InvalidMessageSchema');
    }

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
