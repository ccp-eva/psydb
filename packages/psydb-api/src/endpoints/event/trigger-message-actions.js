'use strict';
var ResponseBody = require('../../lib/response-body');
var updateModifiedRecordStates = require('./update-modified-record-states');

var triggerMessageActions = async (context, next) => {
    var { db, rohrpost, messageHandler, message, personnelId } = context;

    try {
        await messageHandler.triggerSystemEvents({
            db,
            rohrpost,
            message,
            personnelId,
        });

        await updateModifiedRecordStates(context);
    }
    catch (error) {
        // TODO
        //await rohrpost.rollback()
        throw error;
    }
    
    await context.rohrpost.unlockModifiedChannels()
    // TODO
    // await messageHandler.triggerOtherSideEffects({
    //     db, message, personnelId
    // }) // mails etc
    
    await next();
}

module.exports = triggerMessageActions;
