'use strict';
var inline = require('@cdxoo/inline-text');

var { 
    StripEventsStage,
} = require('./fetch-record-helpers');

var fetchCustomRecordTypes = async ({ db, collection, additionalStages }) => {
    var customRecordTypes = await (
        db.collection('customRecordType').aggregate([
            { $match: {
                collection,
                'state.isNew': false,
            }},
            StripEventsStage(),
            ...(additionalStages ? additionalStages : [])
        ]).toArray()
    );

    return customRecordTypes;
}

module.exports = fetchCustomRecordTypes;
