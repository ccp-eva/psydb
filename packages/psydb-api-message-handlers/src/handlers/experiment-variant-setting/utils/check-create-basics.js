'use strict';
var ApiError = require('@mpieva/psydb-api-lib/src/api-error');
var checkForeignIdsExist = require('../../../lib/check-foreign-ids-exist');

var checkCreateBasics = async ({
    db,
    permissions,
    cache,
    message,
    type
}) => {

    // TODO permissions
    /*if (!permissions.hasRootAccess) {
        //throw new ApiError(403);
    }*/

    var {
        studyId,
        experimentVariantId,
        props
    } = message.payload;

    // TODO: use FK to check existance (?)
    await checkForeignIdsExist(db, {
        //'study': [ a, b ],
        'study': studyId,
        'experimentVariant': experimentVariantId,
    });

    var experimentVariant = await (
        db.collection('experimentVariant')
        .findOne(
            { _id: experimentVariantId },
            { projection: { events: false }}
        )
    );

    if (experimentVariant.type !== type) {
        throw new ApiError(400, 'VariantTypeMismatch');
    }

    var {
        subjectTypeKey,
    } = props;

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

    if (conflictingSettings.length > 0) {
        throw new ApiError(400, 'SubjectTypeConflictsWithOtherSetting');
    }

    cache.subjectTypeRecord = subjectTypeRecord;
}

module.exports = checkCreateBasics;
