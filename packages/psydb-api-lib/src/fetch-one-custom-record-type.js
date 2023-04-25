'use strict';
var inline = require('@cdxoo/inline-text');
var withRetracedErrors = require('./with-retraced-errors');

var { 
    StripEventsStage,
} = require('./fetch-record-helpers');

var fetchCustomRecordType = async ({ db, collection, type }) => {
    var customRecordTypes = await withRetracedErrors(
        db.collection('customRecordType').aggregate([
            { $match: {
                collection, type,
                'state.internals.isRemoved': { $ne: true }
            }},
            StripEventsStage(),
            /*{ $project: {
                'collection': true,
                'type': true ,
                'state.isNew': true,
                'state.settings': true
            }}*/
        ]).toArray()
    );

    if (customRecordTypes.length < 1) {
        throw new Error(inline`
            no customRecordType entry found for
            collection "${collection}" with type "${type}"
        `);
    }
    else if (customRecordTypes.length > 1) {
        throw new Error(inline`
            multiple customRecordType entries found for
            collection "${collection}" with type "${type}"
        `);
    }

    //console.log(customRecordTypes);
    var customRecordType = customRecordTypes[0];
    if (customRecordType.isNew) {
        throw new Error(inline`
            custom record type for collection "${collection}"
            with type "${type}" is flagged as "new" and
            has never been commited; please create an 
            initial commit first
        `);
    }
    
    return customRecordType;
}

module.exports = fetchCustomRecordType
