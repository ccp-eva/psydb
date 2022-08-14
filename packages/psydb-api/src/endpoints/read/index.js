'use strict';
var debug = require('debug')('psydb:api:endpoints:read');

var inlineString = require('@cdxoo/inline-string');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var {
    ApiError,
    Ajv,
    ResponseBody,

    createSchemaForRecord,
    fetchOneCustomRecordType,
    fetchRecordById,
    fetchRelatedLabels,
    fetchRelatedLabelsForMany,

    validateOrThrow
} = require('@mpieva/psydb-api-lib');

var {
    gatherRemovedFields
} = require('@mpieva/psydb-api-lib/src/crt-utils');

var ParamsSchema = require('./params-schema');

var read = async (context, next) => {
    var { 
        db,
        permissions,
        params,
    } = context;

    
    validateOrThrow({
        schema: ParamsSchema(),
        payload: params
    });

    var {
        collectionName,
        //recordType,
        id,
    } = params;

    // TODO: check param format

    var collectionCreatorData = allSchemaCreators[collectionName];
    if (!collectionCreatorData) {
        throw new Error(
            `no creator data found for collection "${collectionName}"`
        );
    }
    
    var {
        hasCustomTypes,
        hasSubChannels,
        recordLabelDefinition,
    } = collectionCreatorData;

    var removedCustomFields = [];

    var recordType = undefined;
    if (hasCustomTypes) {
        var stub = await (
            db.collection(collectionName)
            .findOne({ _id: id }, { projection: { type: true }})
        );
        if (!stub) {
            throw new ApiError(404, 'NoAccessibleRecordFound');
        }
        recordType = stub.type;

        var customRecordType = await fetchOneCustomRecordType({
            db,
            collection: collectionName,
            type: recordType,
        });
        
        recordLabelDefinition = (
            customRecordType.state.recordLabelDefinition
        );

        removedCustomFields = gatherRemovedFields(customRecordType);
    }

    var record = await fetchRecordById({
        db,
        collectionName: collectionName,
        id: id,
        hasSubChannels,
        permissions,
        recordLabelDefinition,
        removedCustomFields,
    });

    // FIXME: question is should we 404 or 403 when access is denied?
    // well 404 for now and treat it as if it wasnt found kinda
    if (!record) {
        throw new ApiError(404, 'NoAccessibleRecordFound');
    }

    var recordSchema = await createSchemaForRecord({
        db,
        collectionName: collectionName,
        record,
        fullSchema: true,
        additionalSchemaCreatorArgs: {
            // FIXME: so i kinda wanna disable it some of the times
            // because we dont want to update them directly
            // but there are instances where i need to read them
            // so this is a bit inconsistent since with the metadata
            // endpoint since we deliver data that is not in the
            // schema retrieved from that endpoint
            //enableInternalProps: false,
        }
    });

    // FIXME: thats too hacky
    // we might need to pass the schema down to the fetcher or something
    if (record.gdpr && record.gdpr._lastKnownEventId === null) {
        delete record.gdpr;
    }
    if (record.scientific && record.scientific._lastKnownEventId === null) {
        delete record.scientific;
    }
    if (collectionName === 'personnel') {
        delete record.scientific.state.internals.passwordHash;
    }

    var related = await fetchRelatedLabelsForMany({
        db, collectionName, records: [ record ]
    });

    /*var {
        relatedRecords,
        relatedHelperSetItems,
        relatedCustomRecordTypes,
    } = await fetchRelatedLabels({
        db,
        data: record,
        schema: recordSchema,
    });*/

    context.body = ResponseBody({
        data: {
            record,
            ...related,
            //relatedRecordLabels: relatedRecords,
            //relatedHelperSetItems,
            //relatedCustomRecordTypeLabels: relatedCustomRecordTypes,
        }
    });

    await next();
}

module.exports = read;
