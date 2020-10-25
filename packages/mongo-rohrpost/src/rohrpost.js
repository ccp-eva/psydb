'use strict';
var Collection = require('./collection'),
    ModificationCache = require('./modification-cache');

var Rohrpost = ({
    db,
    correlationId,
    createChannelId,
    createChannelEventId,
    disableChannelLocking,
}) => {
    var rohrpost = {},
        modificationCache = ModificationCache();

    rohrpost.openCollection = (name) => (
        Collection({
            name,

            db,
            correlationId,
            createChannelId,
            createChannelEventId,
            disableChannelLocking,
            modificationCache,
        })
    )

    rohrpost.unlockModifiedChannels = async () => {
        if (disableChannelLocking) {
            console.warn('channel locking is disabled thus unlockModifiedChannels() should not be called');
        }
        else {
            var modified = modificationCache.all();
            // FIXME: this could probably done in parrallel
            for (var i = 0; i < modified.length; i += 1) {
                var { collectionName, id } = modified[i];
                await db.collection(collectionName).updateOne(
                    {
                        _id: id,
                    },
                    { $set: {
                        //'events.$[event].processed': true,
                        'events.$[].processed': true,
                    }},
                    /*{ arrayFilters: [
                        { 'event.correlationId': correlationId }
                    ]}*/
                );
            }
        }
    }

    return rohrpost;
}

module.exports = Rohrpost;
