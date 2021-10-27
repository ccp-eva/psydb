'use strict';
var {
    gatherLocationsFromLabProcedureSettings
} = require('@mpieva/psydb-common-lib');

var compareIds = require('./compare-ids');
var createRecordLabel = require('./create-record-label');
var fetchOneCustomRecordType = require('./fetch-one-custom-record-type');

var fetchEnabledLocationRecordsForStudy = async ({
    db,
    studyId,
    locationType,
}) => {

    var locationTypeRecord = await fetchOneCustomRecordType({
        db,
        collection: 'location',
        type: locationType
    });

    var settingRecords = await (
        db.collection('experimentVariantSetting')
        .find({
            type: { $in: [
                'inhouse',
                'online-video-call'
            ]},
            'state.locations.customRecordTypeKey': locationType
        }, { projection: { events: false }})
        .toArray()
    );

    var locationsByType = gatherLocationsFromLabProcedureSettings({
        settingRecords
    });

    if (!locationsByType[locationType]) {
        return [];
    }

    var locationRecords = await (
        db.collection('location').aggregate([
            { $match: {
                _id: { $in: locationsByType[locationType] }
            }},
            { $project: { events: false }},
        ]).toArray()
    );
    
    locationRecords.forEach(it => {
        it._recordLabel = createRecordLabel({
            record: it,
            definition: locationTypeRecord.state.recordLabelDefinition
        })
    })
    
    return locationRecords;
}

module.exports = fetchEnabledLocationRecordsForStudy;
