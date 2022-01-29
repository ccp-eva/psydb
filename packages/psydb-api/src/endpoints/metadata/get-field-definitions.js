'use strict';
var debug = require('debug')('psydb:api:endpoints:metadata');
var inline = require('@cdxoo/inline-text');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var {
    ApiError,
    ResponseBody,
    fetchOneCustomRecordType
} = require('@mpieva/psydb-api-lib');

var getFieldDefinitions = async (context, next) => {
    var { db, params, query } = context;
    var { collectionName, recordType } = params;
    
    var collectionCreatorData = allSchemaCreators[collectionName];
    if (!collectionCreatorData || collectionName === 'customRecordType') {
        throw new ApiError(400, 'InvalidCollection');
    }

    var {
        hasCustomTypes,
        hasSubChannels
    } = collectionCreatorData;

    // FIXME: we might be able to check that
    // via param schema
    if (hasCustomTypes && !recordType) {
        throw new ApiError(400, 'RecordTypeRequired');
    }

    var crt = await fetchOneCustomRecordType({
        db,
        collection: collectionName,
        type: recordType
    });
    if (!crt) {
        throw new Error(inline`
            could not find custom record type for
            "${collectionName}/${recordType}"
        `);
    }
        
    var fieldDefinitions = (
        hasSubChannels
        ? crt.state.settings.subChannelFields
        : crt.state.settings.fields
    );

    context.body = ResponseBody({
        data: fieldDefinitions,
    });

    await next();
}

module.exports = getFieldDefinitions;
