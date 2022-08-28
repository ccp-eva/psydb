'use strict';
var inline = require('@cdxoo/inline-text');

var {
    InvalidCollection,
    RecordTypeRequired,
    RecordTypeNotFound
} = require('@mpieva/psydb-api-lib-errors');

var {
    convertCRTRecordToSettings,
    CRTSettings
} = require('@mpieva/psydb-common-lib');

var allSchemaCreators = require('@mpieva/psydb-schema-creators');
var fetchOneCustomRecordType = require('./fetch-one-custom-record-type');

var fetchCRTSettings = async (options) => {
    var { db, collectionName, recordType, wrap = false } = options;

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

    var converted = convertCRTRecordToSettings(crt);
    if (wrap === true) {
        return CRTSettings({ data: converted });
    }
    else {
        return converted;
    }
}

module.exports = fetchCRTSettings;
