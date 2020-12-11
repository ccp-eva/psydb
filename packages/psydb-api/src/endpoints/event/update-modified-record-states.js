'use strict';
var Ajv = require('../../lib/ajv'),
    createSchemas = require('../../lib/create-schemas'),
    calculateRecordState = require('./calculate-record-state');

var updateModifiedRecordStates = async (context, next) => {
    var { db, rohrpost } = context;

    var schemas = await createSchemas({ db });

    // FIXME: ajv construction is a little slow
    var ajv = Ajv({
        // make the validate function create defaults for
        // missing required values
        useDefaults: true,
        // ensure that internals are created
        disableProhibitedKeyword: true
    });

    // TODO: i think personnel email adresses need special handling
    // to prevent duplicates so i gues sthey have to be a
    // separate message type and need to go into internals
    var modifiedChannels = rohrpost.getModifiedChannels();
    for (var it of modifiedChannels) {
        
        var {
            collectionName: collection,
            id: channelId,
            subChannelKey
        } = it;

        var nextState = await calculateRecordState({
            db,
            ajv,
            schemas: schemas.records,

            collection,
            channelId,
            subChannelKey,
        });

        var path = (
            subChannelKey
            ? `${subChannelKey}.state`
            : 'state'
        );
        await (
            db.collection(collection).updateOne(
                { _id: channelId },
                { $set: {
                    [path]: nextState
                }}
            )
        );
    }
    
    await next();
}

module.exports = updateModifiedRecordStates;
