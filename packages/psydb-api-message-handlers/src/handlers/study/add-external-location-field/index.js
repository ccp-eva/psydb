'use strict';
// TODO: obsolete
var debug = require('debug')('psydb:api:message-handlers');

var nanoid = require('nanoid').nanoid;

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    compareIds = require('@mpieva/psydb-api-lib/src/compare-ids');

var SimpleHandler = require('../../../lib/simple-handler'),
    checkForeignIdsExist = require('../../../lib/check-foreign-ids-exist'),
    PushMaker = require('../../../lib/push-maker');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'study/add-external-location-field',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message
}) => {
    // TODO
    if (!permissions.hasRootAccess) {
        //throw new ApiError(403);
    }

    var {
        id,
        lastKnownEventId,
        subjectType,
        locationFieldKey,
    } = message.payload;

    var study = await (
        db.collection('study')
        .findOne({ _id: id })
    );

    if (!study) {
        throw new ApiError(404, 'StudyNotFound');
    }

    for (var it of study.state.externalTestLocationFields) {
        if (it.subjectType === subjectType) {
            throw new ApiError(400, 'DuplicateTargetSubjectType')
        }
    }

    var subjectTypeRecord = await (
        db.collection('customRecordType')
        .findOne({ collection: 'subject', type: subjectType })
    );

    if (!subjectTypeRecord) {
        throw new ApiError(400, 'InvalidSubjectType');
    }

    var isFieldThere = false,
        isFieldLocationFK = false;
    for (var it of subjectTypeRecord.state.settings.subChannelFields.scientific) {
        if (it.key === locationFieldKey) {
            isFieldThere = true;
            if (it.type === 'ForeignId' && it.props.collection === 'location') {
                isFieldLocationFK = true;
            }
        }
    }
    
    if (!isFieldThere || !isFieldLocationFK) {
        throw new ApiError(400, 'InvalidLocationFieldKey');
    }
}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    personnelId,
}) => {
    var { type: messageType, payload } = message;
    var {
        id,
        lastKnownEventId,
        subjectType,
        locationFieldKey,
    } = payload;

    var channel = (
        rohrpost
        .openCollection('study')
        .openChannel({
            id,
        })
    );

    var messages = PushMaker({ personnelId }).all({
        '/state/externalTestLocationFields': {
            subjectType,
            locationFieldKey,
        },
    });

    await channel.dispatchMany({ messages, lastKnownEventId });
}

module.exports = handler;
