'use strict';
var inline = require('@cdxoo/inline-text');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var {
    ExactObject,
} = require('@mpieva/psydb-schema-fields');

var fetchCustomRecordType = require('./fetch-custom-record-type');

var createSchemaForRecordType = async ({
    db,
    collectionName,
    recordType,
    customRecordTypeCollection,
    subChannelKey,
    fullSchema,
    prefetchedCustomRecordTypes
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

    if (!fullSchema) {
        if (subChannelKey) {
            if (!hasSubChannels) {
                throw new Error(inline`
                    collection "${collection}" does not support subchannels
                `);
            }
            if (!subChannelStateSchemaCreators[subChannelKey]) {
                throw new Error(inline`
                    collection "${collection}" has no schema creator for
                    sub-channel key "${subChannelKey}"
                `);
            }
        }
        else {
            if (hasSubChannels) {
                throw new Error(inline`
                    collection "${collection}" has sub channels but no key
                    was providede
                `);
            }
        }
    }

    var args = {
        enableInternalProps: true,
    };

    if (hasCustomTypes) {
        var customRecordType = undefined;
        if (prefetchedCustomRecordTypes) {
            var filtered = prefetchedCustomRecordTypes.filter(it => ({
                collection: collectionName,
                type: recordType
            }));
            if (filtered.length < 1) {
                throw new Error(inline`
                    could not find ${collectionName}/${recordType}
                    in prefteched custom record type list
                `);
            }
            customRecordType = filtered[0];
        }
        else {
            customRecordType = await fetchCustomRecordType({
                db,
                collection: collectionName,
                type: recordType
            });
        }
    
        if (hasSubChannels) {
            args.subChannelCustomRecordFieldDefinitions = (
                customRecordType.state.settings.subChannelFields
            );
        }
        else {
            args.customFieldDefinitions = (
                customRecordType.state.settings.fields
            );
        }
    }

    // this collection needs extra argument
    if (collectionName === 'customRecordType') {
        args.collection = customRecordTypeCollection;
    }

    var SchemaCreator = (
        fullSchema === true
        ? FullRecordSchemaCreator({
            collectionCreatorData,
            recordType: recordType,
        })
        : StateSchemaCreator({
            collectionCreatorData,
            recordType: recordType,
            subChannelKey
        })
    );

    var schema = SchemaCreator({ ...args });

    return schema;
}

var StateSchemaCreator = ({
    collectionCreatorData,
    recordType,
    subChannelKey
}) => {
    var {
        hasCustomTypes,
        hasFixedTypes,
        hasSubChannels,
        subChannelStateSchemaCreators,
    } = collectionCreatorData;

    var SchemaCreator = undefined;
    if (hasSubChannels) {
        SchemaCreator = (
            subChannelStateSchemaCreators[subChannelKey]
        );
    }
    else if (hasFixedTypes) {
        SchemaCreator = (
            collectionCreatorData
            .fixedTypeStateSchemaCreators[recordType]
        );
    }
    else {
        SchemaCreator = collectionCreatorData.State;
    }

    return SchemaCreator;
};

var FullRecordSchemaCreator = ({
    collectionCreatorData,
    recordType
}) => {

    var {
        hasCustomTypes,
        hasFixedTypes,
        hasSubChannels,
        subChannelStateSchemaCreators,
    } = collectionCreatorData;

    var SchemaCreator = undefined;
    if (hasSubChannels) {
        SchemaCreator = ({
            subChannelCustomRecordFieldDefinitions,
            ...otherArgs
        }) => ExactObject({
            properties: {
                // FIXME: hardcoded subchannels
                scientific: ExactObject({
                    properties: {
                        state: subChannelStateSchemaCreators.scientific({
                            customFieldDefinitions: (
                                subChannelCustomRecordFieldDefinitions.scientific
                            ),
                            ...otherArgs
                        })
                    }
                }),
                gdpr: ExactObject({
                    properties: {
                        state: subChannelStateSchemaCreators.gdpr({
                            customFieldDefinitions: (
                                subChannelCustomRecordFieldDefinitions.gdpr
                            ),
                            ...otherArgs
                        })
                    }
                }),
            }
        });
    }
    else if (hasFixedTypes) {
        SchemaCreator = (...args) => ExactObject({
            properties: {
                state: (
                    collectionCreatorData
                    .fixedTypeStateSchemaCreators[recordType](...args)
                )
            }
        });
    }
    else {
        SchemaCreator = (...args) => ExactObject({
            properties: {
                state: collectionCreatorData.State(...args),
            }
        });
    }

    return SchemaCreator;

}


module.exports = createSchemaForRecordType;
