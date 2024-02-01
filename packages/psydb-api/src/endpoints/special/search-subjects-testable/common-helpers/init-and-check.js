'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:searchTestableSubjects:initAndCheck'
);
var { getSystemTimezone } = require('@mpieva/psydb-timezone-helpers');

var {
    keyBy,
    groupBy,
    compareIds,
} = require('@mpieva/psydb-core-utils');

var {
    convertCRTRecordToSettings,
    findCRTAgeFrameField,
} = require('@mpieva/psydb-common-lib');

var {
    ApiError,
    validateOrThrow,

    checkForeignIdsExist,
    fetchOneCustomRecordType,
    gatherDisplayFieldsForRecordType,
} = require('@mpieva/psydb-api-lib');

var {
    StripEventsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var RequestBodySchema = require('./request-body-schema');

var {
    zonedTimeToUtc,
    utcToZonedTime
} = require('date-fns-tz');
// FIXME: redundant
var convertIntervalTZ = (interval, options = {}) => {
    var { sourceTZ, targetTZ } = options;
    var { start, end } = interval;

    if (sourceTZ) {
        start = zonedTimeToUtc(start, sourceTZ);
        end = zonedTimeToUtc(end, sourceTZ);
    }
    if (targetTZ) {
        start = utcToZonedTime(start, targetTZ);
        end = utcToZonedTime(end, targetTZ);
    }

    return { start, end };
}



var initAndCheck = async ({
    db,
    permissions,
    request,
    labProcedureType,
}) => {
    
    validateOrThrow({
        schema: RequestBodySchema(),
        payload: request.body
    });

    // FIXME: the body interval is in utc
    // as client converts its localtime to utc before sending
    request.body.interval = convertIntervalTZ(
        request.body.interval,{
            targetTZ: request.body.timezone,
        }
    )

    var {
        subjectTypeKey,
        studyTypeKey,
        studyIds,
        filters,
    } = request.body;

    // TODO: permissions

    var labProcedureSettingData = await initLabProcedureSettings({
        db,
        labProcedureType,
        subjectTypeKey, 
        studyIds,
    });

    var { ageFrameFilters, ageFrameValueFilters } = await initAgeFrames({
        db, subjectTypeKey, filters,
    });
    
    //console.dir({ ageFrameFilters, ageFrameValueFilters }, { depth: null })

    var studyData = await initStudies({
        db,
        studyTypeKey,
        studyIds,
    })

    var subjectData = await initSubjects({
        db,
        subjectTypeKey,
        labProcedureType,
        permissions
    })

    return ({
        ...request.body,
        ...labProcedureSettingData,
        ...studyData,
        ...subjectData,
        ageFrameFilters,
        ageFrameValueFilters,
        now: new Date(),
    });
}

var initLabProcedureSettings = async (options) => {
    var {
        db,
        labProcedureType,
        subjectTypeKey, 
        studyIds,
    } = options;

    var settingRecords = await (
        db.collection('experimentVariantSetting').aggregate([
            StripEventsStage(),
            { $match: {
                type: labProcedureType,
                studyId: { $in: studyIds },
                'state.subjectTypeKey': subjectTypeKey,
            }},
        ]).toArray()
    );
    
    var settingRecordsByStudy = groupBy({
        items: settingRecords,
        byProp: 'studyId'
    });

    for (var id of studyIds) {
        if (!settingRecordsByStudy[id]) {
            throw new ApiError(400, {
                apiStatus: 'StudyDoesNotHaveLabProcedure',
            });
        }
    }

    return {
        labProcedureSettingRecords: settingRecords,
    }
}

var initAgeFrames = async ({
    db,
    subjectTypeKey,
    filters,
}) => {

    var ageFrameFilters = [];
    var valueFilters = [];

    for (var it of filters) {
        if (it.isEnabled) {
            var target = (
                it.pointer
                ? valueFilters
                : ageFrameFilters
            );
            target.push(it);
        }
    }

    var ageFrameIds = ageFrameFilters.map(it => it.ageFrameId);
    await checkForeignIdsExist(db, {
        'ageFrame': ageFrameIds,
    });

    var ageFrameRecords = await (
        db.collection('ageFrame').aggregate([
            StripEventsStage(),
            { $match: {
                _id: { $in: ageFrameIds }, // only enabled frames
                subjectTypeKey,
            }},
        ]).toArray()
    );

    // weed out those that belong to disabled age frames
    valueFilters = valueFilters.filter(value => (
        ageFrameRecords.find(af => compareIds(
            af._id, value.ageFrameId
        ))
    ));

    var unwoundAgeFrameRecords = [];
    if (valueFilters.length > 0) {
        unwoundAgeFrameRecords = await (
            db.collection('ageFrame').aggregate([
                StripEventsStage(),
                { $match: {
                    _id: { $in: ageFrameIds }, // only enabled frames
                    subjectTypeKey,
                }},
                { $unwind: '$state.conditions' },
                { $unwind: '$state.conditions.values' },
                { $addFields: {
                    stringlyValue: { $toString: '$state.conditions.values'}
                }},
                { $match: {
                    // only enabled values of enabled ageframes
                    $or: valueFilters.map(it => ({
                        _id: it.ageFrameId,
                        'state.conditions.pointer': it.pointer,
                        // FIXME: valueFilters value is always string
                        //'state.conditions.values': it.value
                        stringlyValue: it.value,
                    }))
                }}
            ]).toArray()
        );
        //console.log(valueFilters);
        //console.log(unwoundAgeFrameRecords);

        if (unwoundAgeFrameRecords.length != valueFilters.length) {
            throw new ApiError(400, {
                apiStatus: 'InvalidFilters',
            });
        }
    }

    return {
        ageFrameFilters: ageFrameRecords.map(it => ({
            ageFrameId: it._id,
            studyId: it.studyId,
            interval: it.state.interval,
        })),
        ageFrameValueFilters: unwoundAgeFrameRecords.map(it => ({
            ageFrameId: it._id,
            studyId: it.studyId,
            interval: it.state.interval,
            pointer: it.state.conditions.pointer,
            value: it.state.conditions.values
        }))
    };
}

var initStudies = async ({
    db,
    studyTypeKey,
    studyIds,
}) => {
    var studyTypeRecord = await fetchOneCustomRecordType({
        db,
        collection: 'study',
        type: studyTypeKey,
    });

    if (!studyTypeRecord) {
        throw new ApiError(400, 'InvalidStudyRecordType');
    }

    var studyRecords = await db.collection('study').aggregate([
        { $match: {
            //_id: { $in: unwoundAgeFrameRecords.map(it => it.studyId) }
            _id: { $in: studyIds }
        }},
        StripEventsStage(),
    ]).toArray()

    return {
        studyTypeKey,
        studyTypeRecord,
        studyIds: studyRecords.map(it => it._id),
        studyRecords,
        studyRecordLabelDefinition: (
            studyTypeRecord.state.recordLabelDefinition
        ),
    }
}

var initSubjects = async ({
    db,
    subjectTypeKey,
    labProcedureType,
    permissions
}) => {

    var subjectTypeRecord = await fetchOneCustomRecordType({
        db,
        collection: 'subject',
        type: subjectTypeKey,
    });

   var {
       displayFields,
       availableDisplayFieldData,
   } = await gatherDisplayFieldsForRecordType({
       prefetched: subjectTypeRecord,
       target: (
            ['inhouse', 'online-video-call'].includes(labProcedureType)
            ? 'invite-selection-list'
            : 'away-team-selection-list'
       ),
       permissions
   });

    var fieldsByPointer = keyBy({
        items: availableDisplayFieldData,
        byProp: 'pointer'
    });

    // NOTE: augmenting displayNames of fields to definition tokens
    // for quicksearch fields to have proper labeling
    for (var it of subjectTypeRecord.state.recordLabelDefinition.tokens) {
        var { dataPointer, pointer } = it;
        var field = fieldsByPointer[pointer || dataPointer];
        it.displayName = field.displayName;
    }

    var subjectCRTSettings = convertCRTRecordToSettings(subjectTypeRecord);
    var dobFieldPointer = findCRTAgeFrameField(subjectCRTSettings);

    return {
        subjectTypeKey,
        subjectTypeRecord,
        subjectDisplayFields: displayFields,
        subjectAvailableDisplayFieldData: availableDisplayFieldData,
        subjectRecordLabelDefinition: (
            subjectTypeRecord.state.recordLabelDefinition
        ),
        dobFieldPointer,
    }
}

module.exports = initAndCheck;
