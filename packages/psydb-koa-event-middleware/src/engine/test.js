var inline = require('@cdxoo/inline-text'),
    jsonpointer = require('jsonpointer'),
    cleateClone = require('copy-anything');

var {
    isArray,
    isPlainObject
} = require('is-what');


createMessageHandling({
    enableChecks,
    availableMessageHandlers,

    //mqSettings,
    //rohrpostSettings
    
    recalculateSettings: {
        createInitialChannelState: async ({
            collectionName,
            channelId,
            subChannelKey,
            storedRecord,
        }) => {

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
                var { type, subtype } = storedRecord;
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
            var defaults = {};
            ajv.validate(channelStateSchema, defaults);

            return defaults;
    
        },

        handleChannelEvent: ({ nextState, event }) => {
            var { type, payload } = event.message;
            
            if (type === 'commit') {
                nextCommit = clone(nextState);
            }
            else {
                var handler = typeHandlers[type];

                if (!handler) {
                    // TODO: log/error // general handler?
                    throw new Error(`no handler found for "${type}" event type`);
                }
                else {
                    nextState = handler(nextState, payload);
                }
            }

        }
    } 
})

// TODO: this can fail we need to wrap it and handle exceptions
// TODO: exception types
// TODO: figure out if non immutability of jsoinpointer set
// matters in some cases
var typeHandlers = {
    'put': (state, { prop, value }) => {
        jsonpointer.set(state, prop, value);
        return state;
    },
    'push': (state, { prop, value }) => {
        jsonpointer.set(state, `${prop}/-`, value);
        return state;
    },
    'remove': (state, { prop }) => {
        if (prop === '/') {
            // this actually returns undefined not the root object
            throw new Error(inline`
                invalid prop pointer "/",
                its not possible to remove the root object itself
            `);
        }
        if (prop === '') {
            throw new Error(inline`
                invalid prop pointer "",
                its not possible to remove the root object itself
            `);
        }
        
        var tokens = prop.split('/'),
            removeKey = tokens.splice(-1)[0],
            containerProp = tokens.join('/');

        var value = jsonpointer.get(state, containerProp);
        if (isArray(value)) {
            // non-immutable; abuses the fact that we can manipulate refs
            value.splice(removeKey, 1);
        }
        else if (isPlainObject(value)) {
            // non-immutable; abuses the fact that we can manipulate refs
            delete value[removeKey];
        }
        else {
            throw new Error(inline`
                property in pointer is not contained
                in an object or array`
            );
        }
            
        return state;
    }
}
