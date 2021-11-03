'use strict';
var { unique } = require('@mpieva/psydb-common-lib');
var { ApiError } = require('@mpieva/psydb-api-lib');

var prepareTargetLocation = async (context, options) => {
    var {
        db,
        cache,
    } = context;

    var {
        studyId,
        locationId,
        experimentType,
    } = options;


    var settingRecords = await (
        db.collection('experimentVariantSetting').aggregate([
            { $match: {
                type: experimentType,
                studyId,
            }},
            //StripEventsStage()
        ]).toArray()
    );

    var allSettingLocations = settingRecords.reduce((acc, it) => ([
        ...acc,
        ...it.state.locations
    ]), []);

    var allSettingLocationTypeKeys = unique(allSettingLocations.map(
        it => it.customRecordTypeKey
    ));

    if (allSettingLocationTypeKeys.length > 1) {
        throw new ApiError(400, {
            apiStatus: 'SubjectLocationTypeConflict',
            data: { locationTypeKeys: allSettingLocationTypeKeys }
        });
    }

    var enabledLocationIds = unique(allSettingLocations.map(
        it => it.locationId,
    ));

    var locationRecord = await (
        db.collection('location').findOne({
            $and: [
                { _id: locationId },
                { _id: { $in: enabledLocationIds }}
            ]
        })
    )

    if (!locationRecord) {
        throw new ApiError(400, 'InvalidLocationId');
    }

    cache.locationRecord = locationRecord;
    
}

module.exports = prepareTargetLocation;
