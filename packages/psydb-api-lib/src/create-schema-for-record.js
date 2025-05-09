'use strict';
var inline = require('@cdxoo/inline-text');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var {
    ExactObject,
} = require('@mpieva/psydb-schema-fields');

var createSchemaForRecordType = require('./create-schema-for-record-type');

var createSchemaForRecord = async ({
    db,
    collectionName,
    record,
    subChannelKey,
    fullSchema,
    prefetchedCustomRecordTypes,
    additionalSchemaCreatorArgs,
}) => {
    additionalSchemaCreatorArgs = additionalSchemaCreatorArgs || {};

    switch (collectionName) {
        case 'customRecordType':
            additionalSchemaCreatorArgs = {
                collection: record.collection,
                ...additionalSchemaCreatorArgs,
            }
            break;
    }

    return await createSchemaForRecordType({
        db,
        collectionName,
        recordType: record.type,
        subChannelKey,
        fullSchema,
        prefetchedCustomRecordTypes,
        additionalSchemaCreatorArgs,
    });

}

module.exports = createSchemaForRecord;
