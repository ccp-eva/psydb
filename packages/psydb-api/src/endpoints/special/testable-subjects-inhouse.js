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

    var subjectTypeSettingsByStudy = {};
    for (var study of studyRecords) {
        var subjectTypeSettingsItem = (
            study.state.subjectTypeSettings.find(it => (
                it.customRecordType === subjectRecordType
            ))
        )
        
        if (!subjectTypeSettingsItem) {
            throw new ApiError(400, 'SubjectTypeMissingInSelectedStudy');
        }

        subjectTypeSettingsByStudy[study._id] = subjectTypeSettingsItem;
    }

    var conditionsByStudy = {};
    for (var study of studyRecords) {
        conditionsByStudy[study._id] = makeCondition({
            timeFrameStart,
            timeFrameEnd,
            subjectRecordTypeRecord,
            subjectTypeSettings: subjectTypeSettingsByStudy[study._id],
            studyRecord: study,
        });
    }
    
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

var makeCondition = ({
    timeFrameStart,
    timeFrameEnd,
    subjectRecordTypeRecord,
    studyRecord,
    subjectTypeSettings,
}) => {
    var customFields = (
        subjectRecordTypeRecord.state.settings.subChannelFields.scientific
    );

    var ageFrameField = customFields.find(field => (
        field.props.isSpecialAgeFrameField === true
    ))

    var base = {
        // exclude study itself
        'state.participatedInStudyIds': { $nin: [
            studyRecord._id,
            // ... exlcuded studies
        ]},
        // TODO: global conditions
    }

    if (ageFrameField) {
        console.log(subjectTypeSettings);
        var ageFrameConditions = [];
        for (var item of subjectTypeSettings.ageFrameSettings) {
            var { ageFrame, conditionList } = item;

            var timeShifted = {
                // shifting time frame pack by the age frame boundaries
                // ... on the first test day whats the oldest child
                // we can test ? and on the last day of the testing
                // whats the youngest child we can test?
                // ... if we move the testing interval in the past
                // which children are born within the testinterval
                // expanded by the age frame
                start: datefns.sub(timeFrameStart, { days: ageFrame.end }),
                end: datefns.sub(timeFrameEnd, { days: ageFrame.start }),
            }

            var ageFrameFieldPath = `custom.${ageFrameField.key}`;
            ageFrameConditions.push({
                $and: [
                    { [ageFrameFieldPath]: { $gte: timeShifted.start }},
                    { [ageFrameFieldPath]: { $lt: timeShifted.end }},
                ]
            })

            for (var condition of conditionList) {
                //ageFrameConditions.push()
            }

        }
        console.dir(ageFrameConditions, { depth: null });
    }
};

module.exports = testableSubjectsInhouse;
