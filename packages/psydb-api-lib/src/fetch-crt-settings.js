'use strict';
var inline = require('@cdxoo/inline-text');

var {
    InvalidCollection,
    RecordTypeRequired,
    RecordTypeNotFound
} = require('@mpieva/psydb-api-lib-errors');

var allSchemaCreators = require('@mpieva/psydb-schema-creators');
var { convertCRTRecordToSettings } = require('@mpieva/psydb-common-lib');
var fetchOneCustomRecordType = require('./fetch-one-custom-record-type');

var fetchCRTSettings = async (options) => {
    var { db, collectionName, recordType } = options;

    var collectionCreatorData = allSchemaCreators[collectionName];
    if (!collectionCreatorData || collectionName === 'customRecordType') {
        throw new InvalidCollection(`collection name "${collectionName}"`);
    }

    var {
        hasCustomTypes,
        hasSubChannels,
        availableStaticDisplayFields,
    } = collectionCreatorData;

    if (hasCustomTypes && !recordType) {
        throw new RecordTypeRequired(
            `collection "${collectionName}" requires type specification`
        );
    }

    var crt = await fetchOneCustomRecordType({
        db,
        collection: collectionName,
        type: recordType
    });
    if (!crt) {
        throw new RecordTypeNotFound(inline`
            could not find custom record type for
            "${collectionName}/${recordType}"
        `);
    }

    return convertCRTRecordToSettings(crt);
}

module.exports = fetchCRTSettings;
