'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:availableTestLocationsForStudy'
);

var datefns = require('date-fns');

var keyBy = require('@mpieva/psydb-common-lib/src/key-by');
var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv'),
    ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');

var createRecordLabel = require('@mpieva/psydb-api-lib/src/create-record-label');
var gatherAgeFrameDataOfStudy = require('@mpieva/psydb-api-lib/src/gather-age-frame-data-of-study');

var {
    MatchIntervalOverlapStage,
    StripEventsStage,
    AddSubjectTestabilityFieldsStage,
    HasAnyTestabilityStage,
    ProjectDisplayFieldsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var gatherDisplayFieldsForRecordType = require('@mpieva/psydb-api-lib/src/gather-display-fields-for-record-type');

var testableSubjectsInhouse = async (context, next) => {
    var { 
        db,
        permissions,
        request,
    } = context;

    var {
        studyRecordType,
        studyIds,
        subjectRecordType,
        timeFrameStart,
        timeFrameEnd,
        customAgeFrameConditions,
        offset,
        limit,
    } = request.body;

    // TODO: check body + unmarshal
    timeFrameStart = new Date(timeFrameStart);
    timeFrameEnd = new Date(timeFrameEnd);

    // TODO: not sure might be don via endpoint check
    /*if (
        !permissions.hasRootAccess
    ) {
        throw new ApiError(403, 'PermissionDenied');
    }*/

    var studyRecordTypeRecord = await (
        db.collection('customRecordType').findOne(
            { collection: 'study', type: studyRecordType },
            { projection: { events: false }}
        )
    );

    if (!studyRecordTypeRecord) {
        throw new ApiError(400, 'InvalidStudyRecordType');
    }

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
            study.state.selectionSettingsBySubjectType.find(it => {
                console.log(it, subjectRecordType)
                return it.subjectRecordType === subjectRecordType
            })
        )
        
        if (!subjectTypeSettingsItem) {
            throw new ApiError(400, 'SubjectTypeMissingInSelectedStudy');
        }
    }

    var {
        displayFields,
        availableDisplayFieldData,
    } = await gatherDisplayFieldsForRecordType({
        prefetched: subjectRecordTypeRecord,
    });

    var subjectRecords = await db.collection('subject').aggregate([
        { $match: { type: subjectRecordType }},
        // TODO: quicksearch
        /*...QuickSearchStages({
            queryFields,
            fieldTypeConversions,
        }),*/
        // TODO: optimization
        // first match children that ar in any of the timeshifted
        // age frames; this should reduce the size enough most of the time
        AddSubjectTestabilityFieldsStage({
            timeFrameStart,
            timeFrameEnd,
            subjectRecordTypeRecord,
            studyRecords,
            // TODO: ageframe custom verrides
            // TODO: global study settings filters in stage itself
        }),
        HasAnyTestabilityStage({
            studyIds
        }),
        StripEventsStage({ subChannels: ['gdpr', 'scientific']}),
        ProjectDisplayFieldsStage({
            displayFields,
            additionalProjection: {
                '_ageFrameField': true,
                'scientific.state.studyParticipation': true,
                ...( studyIds.reduce((acc, id) => ({
                    ...acc, [`_testableIn_${id}`]: true,
                }), {}))
            }
        }),
    ]).toArray();

    postprocessSubjectRecords({
        subjectRecords,
        subjectRecordType,
        studyRecords,
        timeFrame: {
            start: timeFrameStart,
            end: timeFrameEnd
        }
    })

    var availableDisplayFieldDataByPointer = keyBy({
        items: availableDisplayFieldData,
        byProp: 'dataPointer'
    });

    var displayFieldData = displayFields.map(it => ({
        ...availableDisplayFieldDataByPointer[it.dataPointer],
        dataPointer: it.dataPointer,
    }))

    var selectedStudyLabels = studyRecords.map(it => ({
        _id: it._id,
        _recordLabel: createRecordLabel({
            record: it,
            definition: studyRecordTypeRecord.state.recordLabelDefinition
        })
    }))

    // TODO: fetch relatedRecords and merrge selectedStudyLabels
    //

    context.body = ResponseBody({
        data: {
            relatedRecords: {
                study: keyBy({ items: selectedStudyLabels, byProp: '_id' })
            },
            selectedStudyLabels,
            displayFieldData,
            records: subjectRecords,
        },
    });
    
    await next();
}

var postprocessSubjectRecords = ({
    subjectRecords,
    subjectRecordType,
    studyRecords,
    timeFrame,
}) => {

    var gatheredAgeFrameDataByStudyId = {};
    for (var study of studyRecords) {
        var out = gatherAgeFrameDataOfStudy({
            studyRecord: study,
            subjectRecordType,
            timeFrame,
        });
        gatheredAgeFrameDataByStudyId[study._id] = out;
    }

    subjectRecords.forEach(record => {
        var testableInStudies = [];
        for (var { _id: studyId } of studyRecords) {
            if (record[`_testableIn_${studyId}`]) {
                // TODO
                /*console.log(record.scientific.state.custom);
                var ageFrameData = gatheredAgeFrameDataByStudyId[studyId]
                for (var it of ageFrameData) {
                    var min = datefns.add(record._ageFrameField, { days: it.ageFrame.start });
                    var max = datefns.add(record._ageFrameField, { days: it.ageFrame.end });

                    console.log(min, max);
                }*/
                testableInStudies.push(studyId);
            }
        }
        record._testableInStudies = testableInStudies;
    })

    console.dir(subjectRecords, { depth: null });

}

module.exports = testableSubjectsInhouse;
