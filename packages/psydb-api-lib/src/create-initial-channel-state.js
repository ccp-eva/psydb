'use strict';
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var Ajv = require('./ajv');
var createSchemaForRecordType = require('./create-schema-for-record-type');

var createInitialChannelState = async ({
    db,
    collection,
    recordType,
    subChannelKey,
}) => {

    // FIXME: ajv construction is a little slow
    var ajv = Ajv({
        // make the validate function create defaults for
        // missing required values
        useDefaults: true,
        // ensure that internals are created
        disableProhibitedKeyword: true
    });

    var channelStateSchema = await createSchemaForRecordType({
        db,
        collectionName: collection,
        recordType,
        subChannelKey,
    });

    //console.dir(channelStateSchema, { depth: null });
    
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
