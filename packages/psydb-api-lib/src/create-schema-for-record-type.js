'use strict';
var inline = require('@cdxoo/inline-text');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var {
    ExactObject,
} = require('@mpieva/psydb-schema-fields');

var fetchCustomRecordType = require('./fetch-custom-record-type');
var createSchemaForRecordType = require('@mpieva/psydb-common-lib/src/create-schema-for-record-type');

var createSchemaForRecordTypeWithAutoFetch = async ({
    db,
    collectionName,
    recordType,
    subChannelKey,
    fullSchema,
    prefetchedCustomRecordTypes,
    customRecordTypeCollection,
    // additionalSchemaCreatorArgs
}) => {

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

    var args = {
        enableInternalProps: true,
    };

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
            customRecordType = await fetchCustomRecordType({
                db,
                collection: collectionName,
                type: recordType
            });
        }
    }

    var schema = createSchemaForRecordType({
        collectionName,
        recordType,
        subChannelKey,
        fullSchema,
        customRecordTypeCollection,
        // additionalSchemaCreatorArgs

        prefetchedCustomRecordTypes: [ customRecordType ]
    });

    return schema;
}

module.exports = createSchemaForRecordTypeWithAutoFetch;
