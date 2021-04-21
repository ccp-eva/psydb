'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:availableTestLocationsForStudy'
);

var datefns = require('date-fns');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv');

var {
    MatchIntervalOverlapStage,
    StripEventsStage,
    AddSubjectTestabilityFieldsStage,
    HasAnyTestabilityStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var testableSubjectsInhouse = async (context, next) => {
    var { 
        db,
        permissions,
        request,
    } = context;

    var {
        subjectRecordType,
        studyIds,
        timeFrameStart,
        timeFrameEnd,
        customAgeFrameConditions,
        offset,
        limit,
    } = request.body;

    // TODO: check body + unmarshal
    timeFrameStart = new Date(timeFrameStart);
    timeFrameEnd = new Date(timeFrameEnd);

    var subjectRecordTypeRecord = await (
        db.collection('customRecordType').findOne(
            { collection: 'subject', type: subjectRecordType },
            { projection: { events: false }}
        )
    );

    if (!subjectRecordTypeRecord) {
        throw new ApiError(400, 'InvalidSubjectRecordType');
    }

    var studyRecords = await db.collection('study').aggregate([
        { $match: {
            _id: { $in: studyIds }
        }},
        StripEventsStage(),
    ]).toArray()

    for (var study of studyRecords) {
        var subjectTypeSettingsItem = (
            study.state.subjectTypeSettings.find(it => (
                it.customRecordType === subjectRecordType
            ))
        )
        
        if (!subjectTypeSettingsItem) {
            throw new ApiError(400, 'SubjectTypeMissingInSelectedStudy');
        }
    }

    var subjectRecords = await db.collection('subject').aggregate([
        { $match: { type: subjectRecordType }},
        // TODO: optimization
        // first match children that ar in any of the timeshifted
        // age frames; this should reduce the size enough most of the time
        AddSubjectTestabilityFieldsStage({
            timeFrameStart,
            timeFrameEnd,
            subjectRecordTypeRecord,
            studyRecords,
        }),
        HasAnyTestabilityStage({
            studyIds
        }),
        StripEventsStage({ subChannels: ['gdpr', 'scientific']}),
    ]).toArray();

    console.dir(subjectRecords, { depth: null });


    
    /*var p = { $addFields: {
        _convertedAgeFrameField: {
            $trunc: {
                $divide: [
                    { $subtract: [new Date(), '$custom.FOO'] },
                    24 * HOUR
                ]
            }
        }
    }};*/

    await next();
}

module.exports = testableSubjectsInhouse;
