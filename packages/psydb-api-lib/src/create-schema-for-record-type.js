'use strict';
var inline = require('@cdxoo/inline-text');

var apiConfig = require('@mpieva/psydb-api-config');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');
var createSchemaForRecordType
    = require('@mpieva/psydb-common-lib/src/create-schema-for-record-type');

var fetchOneCustomRecordType = require('./fetch-one-custom-record-type');
var fetchCustomRecordTypes = require('./fetch-custom-record-types');

var createSchemaForRecordTypeWithAutoFetch = async (bag) => {
    var {
        db,
        collectionName,
        recordType,
        subChannelKey,
        fullSchema,
        prefetchedCustomRecordTypes,
        // NOTE: this should be called additionalSchemaCreatorBag
        // as it is an object not an arguments list
        additionalSchemaCreatorArgs
    } = bag;

    additionalSchemaCreatorArgs = additionalSchemaCreatorArgs || {};

    additionalSchemaCreatorArgs = {
        ...additionalSchemaCreatorArgs, apiConfig
    };

    var collectionCreatorData = allSchemaCreators[collectionName];
    if (!collectionCreatorData) {
        throw new Error(
            `no creator data found for collection "${collectionName}"`
        );
    }
    
    var {
        hasCustomTypes,
        hasFixedTypes,
        hasSubChannels,
        subChannelStateSchemaCreators,
    } = collectionCreatorData;

    if (hasCustomTypes) {
        var customRecordType = undefined;
        if (prefetchedCustomRecordTypes) {
            var customRecordType = prefetchedCustomRecordTypes.find(it => ({
                collection: collectionName,
                type: recordType
            }));
            if (!customRecordType) {
                throw new Error(inline`
                    could not find ${collectionName}/${recordType}
                    in prefteched custom record type list
                `);
            }
        }
        else {
            customRecordType = await fetchOneCustomRecordType({
                db,
                collection: collectionName,
                type: recordType
            });
        }
    }

    switch (collectionName) {
        case 'study':
            additionalSchemaCreatorArgs = {
                ...additionalSchemaCreatorArgs,
                subjectRecordTypeRecords: await fetchCustomRecordTypes({
                    db,
                    collection: 'subject',
                })
            }
    }

    var schema = createSchemaForRecordType({
        collectionName,
        recordType,
        subChannelKey,
        fullSchema,
        additionalSchemaCreatorArgs,
        prefetchedCustomRecordTypes: [ customRecordType ]
    });

    return schema;
}

module.exports = createSchemaForRecordTypeWithAutoFetch;
