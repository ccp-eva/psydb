'use strict';
var unlockModifiedChannels = async (context, next) => {
    await context.rohrpost.unlockModifiedChannels()
    await next();
}

module.exports = unlockModifiedChannels;
