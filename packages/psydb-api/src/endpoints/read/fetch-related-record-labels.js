'use strict';

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
            type: stored.type
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

    var StateCreator = undefined;
    if (hasSubChannels) {
        StateCreator = (
            subChannelStateSchemaCreators[subChannelKey]
        );
    }
    else if (hasFixedTypes) {
        StateCreator = (
            collectionCreatorData
            .fixedTypeStateSchemaCreators[stored.type]
        );
    }
    else {
        StateCreator = collectionCreatorData.State;
    }

    var channelStateSchema = StateCreator({ ...args });

    var foreignIdData = resolveForeignIdDataFromState({
        stateSchema: channelStateSchema,
        stateData: record.state
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
