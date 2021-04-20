'use strict';
var compareIds = require('./compare-ids');
var createRecordLabel = require('./create-record-label');

var fetchEnabledLocationRecordsForStudy = async ({
    db,
    studyRecord,
    locationRecordTypeId,
}) => {

    var { inhouseTestLocationSettings } = studyRecord.state;
    var locationTypeSettings = inhouseTestLocationSettings.find(it => (
        compareIds(it.customRecordTypeId, locationRecordTypeId)
    ));

    if (!locationTypeSettings) {
        throw new ApiError(400, 'LocationRecordTypeNotFound');
    }

    var {
        customRecordTypeId,
        enableAllAvailableLocations, // TODO: maybe remove this feature?
        enabledLocationIds,
    } = locationTypeSettings;

    var customRecordTypeRecord = await (
        db.collection('customRecordType').findOne({
            _id: customRecordTypeId
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
