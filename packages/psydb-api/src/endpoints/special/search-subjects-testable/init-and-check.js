'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:searchTestableSubjects:initAndCheck'
);
var { groupBy } = require('@mpieva/psydb-common-lib');
var compareIds = require('@mpieva/psydb-api-lib/src/compare-ids');
var checkForeignIdsExist = require(
    '@mpieva/psydb-api-lib/src/check-foreign-ids-exist'
);

var fetchOneCustomRecordType = require(
    '@mpieva/psydb-api-lib/src/fetch-one-custom-record-type'
);
var gatherDisplayFieldsForRecordType = require(
    '@mpieva/psydb-api-lib/src/gather-display-fields-for-record-type'
);

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv');

var RequestBodySchema = require('./request-body-schema');

var {
    StripEventsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var initAndCheck = async ({
    db,
    permissions,
    request
}) => {
    checkSchema({ request });

    var {
        subjectTypeKey,
        studyTypeKey,
        studyIds,
        filters,
    } = request.body;

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
    })

    return ({
        ...request.body,
        ...studyData,
        ...subjectData,
        ageFrameFilters,
        ageFrameValueFilters,
    });

   // var {
   //     studyRecordType,
   //     studyIds,
   //     subjectRecordType,
   //     timeFrameStart,
   //     timeFrameEnd,
   //     
   //     enabledAgeFrames,
   //     enabledValues,
   //     
   //     offset,
   //     limit,
   // } = request.body;

   // // TODO: check body + unmarshal
   // timeFrameStart = new Date(timeFrameStart);
   // timeFrameEnd = new Date(timeFrameEnd);

   // // TODO: not sure might be don via endpoint check
   // /*if (
   //     !permissions.hasRootAccess
   // ) {
   //     throw new ApiError(403, 'PermissionDenied');
   // }*/

   // var studyTypeRecord = await fetchOneCustomRecordType({
   //     db,
   //     collection: 'study',
   //     type: studyTypeKey,
   // });

   // if (!studyTypeRecord) {
   //     throw new ApiError(400, 'InvalidStudyRecordType');
   // }

   // var subjectRecordTypeRecord = await (
   //     db.collection('customRecordType').findOne(
   //         { collection: 'subject', type: subjectRecordType },
   //         { projection: { events: false }}
   //     )
   // );

   // if (!subjectRecordTypeRecord) {
   //     throw new ApiError(400, 'InvalidSubjectRecordType');
   // }

   // var studyRecords = await db.collection('study').aggregate([
   //     { $match: {
   //         _id: { $in: studyIds }
   //     }},
   //     StripEventsStage(),
   // ]).toArray()

   // for (var study of studyRecords) {
   //     var subjectTypeSettingsItem = (
   //         study.state.selectionSettingsBySubjectType.find(it => {
   //             return it.subjectRecordType === subjectRecordType
   //         })
   //     )
   //     
   //     if (!subjectTypeSettingsItem) {
   //         throw new ApiError(400, 'SubjectTypeMissingInSelectedStudy');
   //     }
   // }

   // var {
   //     displayFields,
   //     availableDisplayFieldData,
   // } = await gatherDisplayFieldsForRecordType({
   //     prefetched: subjectRecordTypeRecord,
   // });

   // var customRecordTypeData = await fetchOneCustomRecordType({
   //     db,
   //     collection: 'subject',
   //     type: subjectRecordType,
   // });

   // var recordLabelDefinition = (
   //     customRecordTypeData.state.recordLabelDefinition
   // );

   // return ({
   //     timeFrameStart,
   //     timeFrameEnd,

   //     studyIds,
   //     studyRecords,
   //     studyRecordLabelDefinition: (
   //         studyRecordTypeRecord.state.recordLabelDefinition
   //     ),

   //     subjectRecordType,
   //     subjectRecordTypeRecord,
   //     subjectDisplayFields: displayFields,
   //     subjectAvailableDisplayFieldData: availableDisplayFieldData,
   //     subjectRecordLabelDefinition: recordLabelDefinition,

   //     enabledAgeFrames,
   //     enabledValues,

   //     limit,
   //     offset,
   // })
}

var checkSchema = ({ request }) => {
    var ajv = Ajv(),
        isValid = false;

    isValid = ajv.validate(
        RequestBodySchema(),
        request.body
    );
    if (!isValid) {
        debug('ajv errors', ajv.errors);
        throw new ApiError(400, {
            apiStatus: 'InvalidRequestSchema',
            data: { ajvErrors: ajv.errors }
        });
    };
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
                { $match: {
                    // only enabled values of enabled ageframes
                    $or: valueFilters.map(it => ({
                        'state.conditions.pointer': it.pointer,
                        'state.conditions.values': it.value
                    }))
                }}
            ]).toArray()
        );

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
   });

    return {
        subjectTypeKey,
        subjectTypeRecord,
        subjectDisplayFields: displayFields,
        subjectAvailableDisplayFieldData: availableDisplayFieldData,
        subjectRecordLabelDefinition: (
            subjectTypeRecord.state.recordLabelDefinition
        ),
    }
}

module.exports = initAndCheck;
