'use strict';
var Ajv = require('../../lib/ajv');

/*var {
    collectionMetadata,
    CustomRecordTypeState,
    HelperSetState,
    HelperSetItemState,
} = require('@mpieva/psydb-schema');*/

var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var createInitialChannelState = async ({
    collectionName: collection,
    channelId,
    subChannelKey,
    storedRecord: stored,
    context
}) => {
    var { db, getRecordSchemas } = context;

    // FIXME: ajv construction is a little slow
    var ajv = Ajv({
        // make the validate function create defaults for
        // missing required values
        useDefaults: true,
        // ensure that internals are created
        disableProhibitedKeyword: true
    });

    var collectionCreatorData = allSchemaCreators[collection];
    if (!collectionCreatorData) {
        throw new Error(`no creator data found for collection "${collection}"`);
    }
    
    var {
        isGenericRecord,
        hasCustomTypes,
        hasFixedTypes,
        hasSubChannels,
        subChannelStateSchemaCreators,
    } = collectionCreatorData;

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

    var args = {
        enableInternalProps: true,
    };

    if (hasCustomTypes) {
        var customRecordType = await findCustomRecordType({
            db,
            collection,
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
    if (collection === 'customRecordType') {
        args.collection = stored.collection;
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
            .fixedTypeStateSchemaCreators[record.type]
        );
    }
    else {
        StateCreator = collectionCreatorData.State;
    }

    var channelStateSchema = StateCreator({ ...args });

    /*var channelStateSchema = undefined;
    if (collection === 'helperSet') {
        channelStateSchema = HelperSetState({
            enableInternalProps: true
        });
    }
    else if (collection === 'helperSetItem') {
        channelStateSchema = HelperSetItemState({
            enableInternalProps: true
        });
    }
    else if (collection === 'customRecordType') {
        channelStateSchema = CustomRecordTypeState({
            collection: stored.collection,
            enableInternalProps: true
        });
    }
    else {
        var { type, subtype } = stored;
        
        var allRecordSchemas = await getRecordSchemas();

        var recordSchemas = allRecordSchemas.find({
            collection, type, subtype
        });
        
        if (!recordSchemas) {
            throw new Error('record schemas not found');
            // TODO: rollback in upper middleware
        }
        
        // TODO: i just noticed that we need the full schema
        // not just the allowed portion when field access is in play
        channelStateSchema = (
            subChannelKey
            ? recordSchemas[subChannelKey]
            : recordSchemas.state
        );
    }*/

    // although called validate() it will initialize
    // the default values of required properties 
    // when useDefaults == true
    var initialState = {};
    //console.dir(channelStateSchema, { depth: null });
    ajv.validate(channelStateSchema, initialState);

    return {
        state: initialState,
    }
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

module.exports = createInitialChannelState;
