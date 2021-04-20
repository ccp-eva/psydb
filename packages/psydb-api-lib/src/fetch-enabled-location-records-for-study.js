'use strict';
var compareIds = require('./compare-ids');
var createRecordLabel = require('./create-record-label');

var fetchEnabledLocationRecordsForStudy = async ({
    db,
    locationTypeSettings,
}) => {

    var {
        customRecordType,
        enableAllAvailableLocations, // TODO: maybe remove this feature?
        enabledLocationIds,
    } = locationTypeSettings;

    var customRecordTypeRecord = await (
        db.collection('customRecordType').findOne({
            collection: 'location',
            type: customRecordType
        })
    );

    var matchStage = (
        enableAllAvailableLocations
        ? ({
            recordType: customRecordTypeRecord.type
        })
        : ({
            _id: { $in: enabledLocationIds }
        })
    );

    var locationRecords = await (
        db.collection('location').aggregate([
            { $match: matchStage },
            { $project: {
                events: false
            }},
        ]).toArray()
    );

    locationRecords.forEach(it => {
        it._recordLabel = createRecordLabel({
            record: it,
            definition: customRecordTypeRecord.state.recordLabelDefinition
        })
    })
    
    return locationRecords;
}

module.exports = fetchEnabledLocationRecordsForStudy;
