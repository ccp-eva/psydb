'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var inline = require('@cdxoo/inline-text');

var {
    createRecordMessageType,
} = require('@mpieva/psydb-schema-helpers');

var parseRecordMessageType = require('./parse-record-message-type');

var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv');


var checkSchema = async ({ db, getRecordSchemas, message }) => {
    var { 
        op, collection, 
        recordType, recordSubType 
    } = parseRecordMessageType(message.type);

    var collectionCreatorData = allSchemaCreators[collection];
    if (!collectionCreatorData) {
        throw new ApiError(400, 'InvalidCollection');
    }
    
    var {
        isGenericRecord,
        hasCustomTypes,
        hasSubChannels,
        RecordMessage
    } = collectionCreatorData;

    if (!isGenericRecord) {
        throw new ApiError(400, 'InvalidCollection');
    }

    var args = {
        op,
    };
    if (hasCustomTypes) {
        var customRecordType = await findCustomRecordType({
            db, collection, type: recordType
        });

        args.type = recordType;

        if (hasSubChannels) {
            args.subChannelCustomFieldDefinitions = (
                customRecordType.state.settings.subChannelFields
            );
        }
        else {
            args.customFieldDefinitions = (
                customRecordType.state.settings.fields
            );
        }
    }

    var schema = RecordMessage({ ...args });

    var ajv = Ajv();

    var isValid = ajv.validate(
        schema,
        message
    );

    if (!isValid) {
        debug('ajv errors', message.type, ajv.errors);
        throw new ApiError(400, 'InvalidMessageSchema');
    }
}

var createItem = ({
    createSchemaCallback, schemas, ...other
}) => ({
    messageType: createRecordMessageType(other),
    schema: createSchemaCallback({
        schemas, ...other
    }),
})

// FIXME: redundant
var findCustomRecordType = async ({ db, collection, type }) => {
    var customRecordTypes = await (
        db.collection('customRecordType').find(
            { collection, type },
            { 'state.isNew': true, 'state.settings': true }
        ).toArray()
    );

    if (customRecordTypes.length < 1) {
        throw new Error(inline`
            no customRecordType entry found for
            collection "${collection}" with type "${type}"
        `);
    }
    else if (customRecordTypes.length > 1) {
        throw new Error(inline`
            multiple customRecordType entries found for
            collection "${collection}" with type "${type}"
        `);
    }

    //console.log(customRecordTypes);
    var customRecordType = customRecordTypes[0];
    if (customRecordType.isNew) {
        throw new Error(inline`
            custom record type for collection "${collection}"
            with type "${type}" is flagged as "new" and
            has never been commited; please create an 
            initial commit first
        `);
    }
    
    return customRecordType;
}

module.exports = checkSchema;
