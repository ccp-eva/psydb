'use strict';

var {
    ExactObject,
    ForeignId
} = require('@mpieva/psydb-schema-fields');

var resolveForeignIdDataFromState =
    require('./resolve-foreign-id-data-from-state');

var fetchRelatedRecordLabels = async ({
    db,
    collectionName,
    collectionCreatorData,
    record
}) => {
    
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
        var customRecordType = await findCustomRecordType({
            db,
            collection: collectionName,
            type: record.type
        });
    
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

    var channelStateSchema = SchemaCreator({ ...args });
    //console.dir(channelStateSchema, { depth: null });

    var foreignIdData = resolveForeignIdDataFromState({
        stateSchema: channelStateSchema,
        stateData: record,
    });

    console.log(foreignIdData);
}


// FIXME: redundant
var findCustomRecordType = async ({ db, collection, type }) => {
    var customRecordTypes = await (
        db.collection('customRecordType').find(
            { collection, type },
            { 'state.isNew': true, 'state.settings': true }
        ).toArray()
    );

    if (customRecordTypes.length < 1) {
        throw new Error(inline`
            no customRecordType entry found for
            collection "${collection}" with type "${type}"
        `);
    }
    else if (customRecordTypes.length > 1) {
        throw new Error(inline`
            multiple customRecordType entries found for
            collection "${collection}" with type "${type}"
        `);
    }

    //console.log(customRecordTypes);
    var customRecordType = customRecordTypes[0];
    if (customRecordType.isNew) {
        throw new Error(inline`
            custom record type for collection "${collection}"
            with type "${type}" is flagged as "new" and
            has never been commited; please create an 
            initial commit first
        `);
    }
    
    return customRecordType;
}

module.exports = fetchRelatedRecordLabels;
