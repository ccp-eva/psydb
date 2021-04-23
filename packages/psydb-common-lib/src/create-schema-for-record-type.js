'use strict';

var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var {
    ExactObject,
    Id,
} = require('@mpieva/psydb-schema-fields');

var createSchemaForRecordType = ({
    collectionName,
    recordType,
    subChannelKey,
    fullSchema,
    prefetchedCustomRecordTypes,
    additionalSchemaCreatorArgs,
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
        ...(additionalSchemaCreatorArgs || {}),
    };
    
    if (hasCustomTypes) {
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

    // theese collection need extra argument
    /*if (collectionName === 'customRecordType') {
        args.collection = (
            additionalSchemaCreatorArgs.customRecordTypeCollection
        );
    }
    if (collectionName === 'study') {
        args.subjectRecordTypeRecords = (
            additionalSchemaCreatorArgs.subjectRecordTypeRecords
        );
    }*/

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
                _id: Id(),
                // FIXME: hardcoded subchannels
                scientific: ExactObject({
                    properties: {
                        state: subChannelStateSchemaCreators.scientific({
                            ...( subChannelCustomRecordFieldDefinitions && {
                                customFieldDefinitions: (
                                    subChannelCustomRecordFieldDefinitions.scientific
                                )
                            }),
                            ...otherArgs
                        })
                    }
                }),
                gdpr: ExactObject({
                    properties: {
                        state: subChannelStateSchemaCreators.gdpr({
                            ...( subChannelCustomRecordFieldDefinitions && {
                                customFieldDefinitions: (
                                    subChannelCustomRecordFieldDefinitions.gdpr
                                )
                            }),
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
                _id: Id(),
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
                _id: Id(),
                state: collectionCreatorData.State(...args),
            }
        });
    }

    return SchemaCreator;

}


module.exports = createSchemaForRecordType;
