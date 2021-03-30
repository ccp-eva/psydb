'use strict';
var Ajv = require('@mpieva/psydb-api-lib/src/ajv');

var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var createSchemaForRecord =
    require('@mpieva/psydb-api-lib/src/create-schema-for-record');

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

    var channelStateSchema = await createSchemaForRecord({
        db,
        collectionName: collection,
        record: stored,
        subChannelKey,
    });
    
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

module.exports = createInitialChannelState;
