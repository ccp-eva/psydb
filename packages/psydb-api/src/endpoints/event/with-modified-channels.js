'use strict';
var withModifiedChannels = async (context, next) => {
    context.modifiedChannels = context.rohrpost.getModifiedChannels()
    await next();
}

module.exports = withModifiedChannels;
