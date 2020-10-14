'use strict';
var Channel = require('./collection');

var Rohrpost = ({
    db,
    correlationId,
    createChannelId,
    createMessageId,
    disableChannelLocking,
}) => {
    var rohrpost = {},
        collectionCache = {};

    rohrpost.openCollection = (name) => {
        collectionCache[name] = (
            collectionCache[name] || Collection({
                name,

                db,
                correlationId,
                createChannelId,
                createMessageId,
                disableChannelLocking,
            })
        );
        return collectionCache[name];
    }

    rohrpost.unlockModifiedChannels = () => {
        if (disableChannelLocking) {
            console.warn('channel locking is disabled this unlockModifiedChannels() should not be called');
        }
        else {
            // TODO
        }
    }

    return rohrpost;
}

module.exports = Rohrpost;
