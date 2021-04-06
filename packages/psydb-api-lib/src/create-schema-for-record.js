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
    prefetchedCustomRecordTypes
}) => {

    return await createSchemaForRecordType({
        db,
        collectionName,
        recordType: record.type,
        customRecordTypeCollection: record.collection,
        subChannelKey,
        fullSchema,
        prefetchedCustomRecordTypes,
    });

}

module.exports = createSchemaForRecord;
