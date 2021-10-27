'use strict';
var fetchOneCustomRecordType = require(
    '@mpieva/psydb-api-lib/src/fetch-one-custom-record-type'
);
var gatherDisplayFieldsForRecordType = require(
    '@mpieva/psydb-api-lib/src/gather-display-fields-for-record-type'
);

var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

var {
    StripEventsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var initAndCheck = async ({
    db,
    permissions,
    request
}) => {
    var {
        studyRecordType,
        studyIds,
        subjectRecordType,
        timeFrameStart,
        timeFrameEnd,
        
        enabledAgeFrames,
        enabledValues,
        
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

    var customRecordTypeData = await fetchOneCustomRecordType({
        db,
        collection: 'subject',
        type: subjectRecordType,
    });

    var recordLabelDefinition = (
        customRecordTypeData.state.recordLabelDefinition
    );

    return ({
        timeFrameStart,
        timeFrameEnd,

        studyIds,
        studyRecords,
        studyRecordLabelDefinition: (
            studyRecordTypeRecord.state.recordLabelDefinition
        ),

        subjectRecordType,
        subjectRecordTypeRecord,
        subjectDisplayFields: displayFields,
        subjectAvailableDisplayFieldData: availableDisplayFieldData,
        subjectRecordLabelDefinition: recordLabelDefinition,

        enabledAgeFrames,
        enabledValues,

        limit,
        offset,
    })
}

module.exports = initAndCheck;
