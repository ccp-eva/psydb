'use strict';
var Ajv = require('../../lib/ajv'),
    createSchemas = require('../../lib/create-schemas'),
    calculateState = require('./calculate-state');

var {
    collectionMetadata,
    CustomRecordTypeState,
    HelperSetState,
    HelperSetItemState,
} = require('@mpieva/psydb-schema');

var updateModifiedRecordStates = async (context) => {
    var { db, rohrpost, recordSchemas: allRecordSchemas } = context;

    //var schemas = await createSchemas({ db });

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
            channelId,
            subChannelKey
        } = it;

        var stored = await (
            db.collection(collection).findOne({ _id: channelId })
        );


        var channelEvents = (
            subChannelKey
            ? stored[subChannelKey].events
            : stored.events
        );

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
            // channelStateSchema = CustomRecordTypeState({
            //     collection: stored.collection
            // });
            // 
            /*channelStateSchema = {
                properties: {
                    label: { type: 'string' },
                    recordLabelDefinition: {
                        type: 'object',
                        properties: {
                            format: { type: 'string' },
                            tokens: { type: 'array' },
                        },
                        required: [
                            'format',
                            'tokens'
                        ],
                    },
                    nextFields: { type: 'array', default: [] },
                    fields: { type: 'array', default: [] },
                },
                required: [ 'label', 'recordLabelDefinitions', 'fields' ]
            };*/
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

        var { nextState, nextCommit } = await calculateState({
            events: channelEvents,
            createDefaultState: () => {
                // although called validate() it will initialize
                // the default values of required properties 
                // when useDefaults == true
                var defaults = {};
                ajv.validate(channelStateSchema, defaults);

                return defaults;
            }
        });

        var statePath = createPath(subChannelKey, 'state'),
            commitPath = createPath(subChannelKey, 'commit');

        await (
            db.collection(collection).updateOne(
                { _id: channelId },
                { $set: {
                    [statePath]: nextState,
                    ...(
                        nextCommit
                        ? { [commitPath]: nextCommit }
                        : {}
                    )
                }}
            )
        );
    }
    
    //await next();
}

var createPath = (subChannelKey, prop) => (
    subChannelKey
    ? `${subChannelKey}.${prop}`
    : prop
)

module.exports = updateModifiedRecordStates;
