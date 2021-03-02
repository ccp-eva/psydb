'use strict';
var storeNextState = async ({
    createInitialChannelState,
    handleChannelEvent,
    context
}) => {
    var { db, rohrpost } = context;

    // TODO: i think personnel email adresses need special handling
    // to prevent duplicates so i gues sthey have to be a
    // separate message type and need to go into internals
    // EDIT: what??
    var modifiedChannels = rohrpost.getModifiedChannels();
    for (var it of modifiedChannels) {    
        var {
            collectionName,
            channelId,
            subChannelKey
        } = it;

        var storedRecord = await (
            db.collection(collectionName).findOne({ _id: channelId })
        );

        var channelEvents = (
            subChannelKey
            ? storedRecord[subChannelKey].events
            : storedRecord.events
        );

        // next contains stuff like
        // {
        //      'state': { ... },
        //      'commits': [ ... ]
        // }
        // FIXME: not fond of the amount of args
        // FIXME: let this engine run in a separate context? (engineContext)
        var nextState = await createInitialChannelState({
            collectionName,
            channelId,
            subChannelKey,
            storedRecord,
            context
        });
        
        channelEvents.reverse().forEach(event => {
            nextState = handleChannelEvent({ nextState, event });
        })

        var updates = (
            Object.keys(nextState)
            .reduce((acc, containerKey) => {
                var path = createPath(subChannelKey, containerKey);
                return {
                    ...acc,
                    [path]: nextState[containerKey]
                };
            }, {})
        );

        await (
            db.collection(collectionName).updateOne(
                { _id: channelId },
                { $set: updates }
            )
        );
    }

}

var createPath = (subChannelKey, prop) => (
    subChannelKey
    ? `${subChannelKey}.${prop}`
    : prop
)

module.exports = storeNextState;
