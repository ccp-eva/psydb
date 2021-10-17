'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

var SimpleHandler = require('../../../../lib/simple-handler'),
    PutMaker = require('../../../../lib/put-maker'),
    checkForeignIdsExist = require('../../../../lib/check-foreign-ids-exist');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment-variant-setting/online-survey/create',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message
}) => {
    // TODO
    if (!permissions.hasRootAccess) {
        throw new ApiError(403);
    }

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

    var {
        subjectTypeKey,
    } = props;

    var customRecordTypeRecord = await (
        db.collection('customRecordType')
        .findOne({ type: subjectTypeKey })
    );

    if (!customRecordTypeRecord) {
        throw new ApiError(400, 'InvalidSubjectRecordType');
    }

    if (customRecordTypeRecord.collection !== 'subject') {
        throw new ApiError(400, 'InvalidSubjectRecordType');
    }

    var conflictingSettings = await (
        db.collection('experimentVariantSetting')
        .find({
            type: 'online-survey',
            studyId,
            experimentVariantId,
            subjectTypeKey
        })
        .toArray()
    );

    if (conflictingSettings.length) {
        throw new ApiError(400, 'SubjectTypeConflictsWithOtherSetting');
    }

}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    personnelId,
}) => {
    var { type: messageType, payload } = message;
    var { id, studyId, experimentVariantId, props } = payload;

    var channel = (
        rohrpost
        .openCollection('experimentVariantSetting')
        .openChannel({
            id,
            isNew: true,
            additionalChannelProps: {
                type: 'online-survey',
                studyId,
                experimentVariantId
            }
        })
    );

    var messages = PutMaker({ personnelId }).all({
        '/state/subjectTypeKey': props.subjectTypeKey,
    });

    await channel.dispatchMany({ messages });
}

module.exports = handler;
