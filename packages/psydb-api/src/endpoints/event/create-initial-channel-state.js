'use strict';
var Ajv = require('../../lib/ajv');

var {
    collectionMetadata,
    CustomRecordTypeState,
    HelperSetState,
    HelperSetItemState,
} = require('@mpieva/psydb-schema');

var createInitialChannelState = async ({
    collectionName: collection,
    channelId,
    subChannelKey,
    storedRecord: stored,
    context
}) => {
    var { db, recordSchemas: allRecordSchemas } = context;
    
    // FIXME: ajv construction is a little slow
    var ajv = Ajv({
        // make the validate function create defaults for
        // missing required values
        useDefaults: true,
        // ensure that internals are created
        disableProhibitedKeyword: true
    });

    var channelStateSchema = undefined;
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
    }

    // although called validate() it will initialize
    // the default values of required properties 
    // when useDefaults == true
    var initialState = {};
    ajv.validate(channelStateSchema, initialState);

    return {
        state: initialState,
    }
}

module.exports = createInitialChannelState;
