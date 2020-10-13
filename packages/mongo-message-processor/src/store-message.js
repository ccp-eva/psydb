'use strict';
var storeMessage = async ({
    db,
    rohrpostKey,

    channelId,
    isNewChannel,

    id,
    timestamp,
    message,
    correlationId,

    onDispatch,
}) => {
    // FIXME: instanceof promise might not handle all thennables
    if (channelId instanceof Promise) {
        channelId = await channelId;
    }
    if (id instanceof Promise) {
        id = await id;
    }

    
    
};
