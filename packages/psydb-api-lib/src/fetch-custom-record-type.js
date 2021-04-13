'use strict';
var inline = require('@cdxoo/inline-text');

var fetchCustomRecordType = async ({ db, collection, type }) => {
    var customRecordTypes = await (
        db.collection('customRecordType').aggregate([
            { $match: {
                collection, type
            }},
            { $project: {
                events: false,
            }}
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
