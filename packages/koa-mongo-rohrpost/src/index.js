'use strict';
var MongoRohrpost = require('@mpieva/mongo-rohrpost');

var createMongoRohrpostMiddleware = ({
    createChannelId,
    createChannelEventId,

    disableChannelLocking,
    disableChannelAutoUnlocking,
}) => {

    if (typeof createChannelId !== 'function') {
        throw new Error('parameter "createChannelId" is required and must be a function');
    }

    if (typeof createChannelEventId !== 'function') {
        throw new Error('parameter "createChannelEventId" is required and must be a function');
    }
    
    return async (context, next) => {
        var { db, correlationId } = context;

        if (!db) {
            throw new Error('failed to get database handle from context');
        }
        if (!correlationId) {
            throw new Error('failed to get correlation id from context');
        }

        var rohrpost = MongoRohrpost({
            db,
            correlationId,

            createChannelId,
            createChannelEventId,
            disableChannelLocking,
        });

        context.rohrpost = rohrpost;
        await next();

        if (!disableChannelLocking && !disableChannelAutoUnlocking) {
            await rohrpost.unlockModifiedChannels();
        }
    }
};

module.exports = createMongoRohrpostMiddleware;
