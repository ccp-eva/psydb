'use strict';
var inline = require('@cdxoo/inline-text');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var {
    ExactObject,
} = require('@mpieva/psydb-schema-fields');

var createSchemaForRecordType = require('./create-schema-for-record-type');
var fetchCustomRecordTypes = require('./fetch-custom-record-types');

var createSchemaForRecord = async ({
    db,
    collectionName,
    record,
    subChannelKey,
    fullSchema,
    prefetchedCustomRecordTypes
}) => {

    var additionalSchemaCreatorArgs = undefined;
    switch (collectionName) {
        case 'customRecordType':
            additionalSchemaCreatorArgs = {
                collection: record.collection
            }
            break;
        case 'study':
            additionalSchemaCreatorArgs = {
                subjectRecordTypeRecords: await fetchCustomRecordTypes({
                    db,
                    collection: 'subject',
                })
            }
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
