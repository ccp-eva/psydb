'use strict';
var inline = require('@cdxoo/inline-text');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var {
    ExactObject,
} = require('@mpieva/psydb-schema-fields');

var createSchemaForRecord = async ({
    db,
    collectionName,
    record,
    fullRecord = false,
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

    var args = {
        enableInternalProps: true,
    };

    if (hasCustomTypes) {
        var customRecordType = undefined;
        if (prefetchedCustomRecordTypes) {
            var filtered = prefetchedCustomRecordTypes.filter(it => ({
                collection: collectionName,
                type: record.type
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
            customRecordType = await findCustomRecordType({
                db,
                collection: collectionName,
                type: record.type
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
        args.collection = record.collection;
    }

    var SchemaCreator = undefined;
    if (hasSubChannels) {
        SchemaCreator = () => ExactObject({
            properties: {
                scientific: ExactObject({
                    properties: {
                        state: subChannelStateSchemaCreators.scientific()
                    }
                }),
                gdpr: ExactObject({
                    properties: {
                        state: subChannelStateSchemaCreators.gdpr()
                    }
                }),
            }
        });
    }
    else if (hasFixedTypes) {
        SchemaCreator = () => ExactObject({
            properties: {
                state: (
                    collectionCreatorData
                    .fixedTypeStateSchemaCreators[stored.type]()
                )
            }
        });
    }
    else {
        SchemaCreator = () => ExactObject({
            properties: {
                state: collectionCreatorData.State(),
            }
        });
    }

    var schema = SchemaCreator({ ...args });

    return schema;
}

module.exports = createSchemaForRecord;
