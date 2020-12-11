'use strict';
var calculateState = require('./calculate-state');

// TODO: type/subtype need to be stored alongside
// _id .... this means that openChannel might need to accept additional
// props that are used when is new additionalInitProps
var calculateRecordState = async ({
    db,
    ajv,
    schemas,
    collection,
    channelId,
    subChannelKey
}) => {
    
    var record = await (
        db.collection(collection).findOne({ _id: channelId })
    );

    var { type, subtype } = record,
        recordSchemas = schemas.find({ collection, type, subtype });

    // TODO: i just noticed that we need the full schema
    // not just the allowed portion when field access is in play
    var channelStateSchema = (
        subChannelKey
        ? recordSchemas[subChannelKey]
        : recordSchemas.state
    );

    var channelEvents = (
        subChannelKey
        ? record[subChannelKey].events
        : record.events
    );

    var nextState = calculateState({
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

    return nextState;
}

module.exports = calculateRecordState;
