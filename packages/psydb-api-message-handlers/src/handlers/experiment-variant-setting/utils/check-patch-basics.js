'use strict';
var ApiError = require('@mpieva/psydb-api-lib/src/api-error');
var checkForeignIdsExist = require('../../../lib/check-foreign-ids-exist');

var checkPatchBasics = async ({
    db,
    permissions,
    cache,
    message,
}) => {

    // TODO: permissions
    /*if (!permissions.hasRootAccess) {
        throw new ApiError(403);
    }*/

    var { id, props } = message.payload;
    var { subjectTypeKey } = props;

    await checkForeignIdsExist(db, {
        'experimentVariantSetting': id,
    });

    var settingRecord = await (
        db.collection('experimentVariantSetting')
        .findOne(
            { _id: id },
            { projection: { events: false }}
        )
    );
    var { type, studyId, experimentVariantId } = settingRecord;

    var subjectTypeRecord = await (
        db.collection('customRecordType')
        .findOne(
            { type: subjectTypeKey },
            { projection: { events: false }}
        )
    );

    if (!subjectTypeRecord) {
        throw new ApiError(400, 'InvalidSubjectRecordType');
    }

    if (subjectTypeRecord.collection !== 'subject') {
        throw new ApiError(400, 'InvalidSubjectRecordType');
    }

    var conflictingSettings = await (
        db.collection('experimentVariantSetting')
        .find({
            type,
            studyId,
            experimentVariantId,
            subjectTypeKey
        })
        .toArray()
    );

    if (conflictingSettings.length) {
        throw new ApiError(400, 'SubjectTypeConflictsWithOtherSetting');
    }

    cache.subjectTypeRecord = subjectTypeRecord;
}

module.exports = checkPatchBasics;
