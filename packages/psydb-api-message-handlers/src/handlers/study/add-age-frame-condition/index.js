'use strict';
// TODO: obsolete
var debug = require('debug')('psydb:api:message-handlers');

var nanoid = require('nanoid').nanoid;

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    compareIds = require('@mpieva/psydb-api-lib/src/compare-ids');

var SimpleHandler = require('../../../lib/simple-handler'),
    PushMaker = require('../../../lib/push-maker');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'study/add-age-frame-condition',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message,
    cache,
}) => {
    // TODO
    if (!permissions.hasRootAccess) {
        throw new ApiError(403);
    }

    var {
        id,
        lastKnownEventId,
        customRecordType,
        ageFrame,
        props,
    } = message.payload;

    var study = await (
        db.collection('study')
        .findOne({ _id: id })
    );

    if (!study) {
        throw new ApiError(404, 'StudyNotFound');
    }

    if (!compareIds(study.events[0]._id, lastKnownEventId)) {
        throw new ApiError(400, 'RecordHasChanged');
    }

    var { selectionSettingsBySubjectType } = study.state;

    var conditionsByAgeFrame = undefined,
        settingsIndex = undefined;
    for (var [index, it] of selectionSettingsBySubjectType.entries()) {
        if (it.subjectRecordType === customRecordType) {
            conditionsByAgeFrame = it.conditionsByAgeFrame;
            settingsIndex = index;
            break;
        }
    }

    if (!conditionsByAgeFrame) {
        throw new ApiError(400, 'InvalidSubjectRecordType');
    }

    var conditions = undefined,
        ageFrameIndex = undefined;
    for (var [index,it] of conditionsByAgeFrame.entries()) {
        if (
            it.ageFrame.start === ageFrame.start
            && it.ageFrame.end === ageFrame.end
        ) {
            conditions = it.conditions;
            ageFrameIndex = index;
            break;
        }
    };

    for (var it of conditions) {
        if (it.fieldKey === props.field) {
             throw new ApiError(400, 'DuplicateConditionField');
        }
    }

    cache.settingsIndex = settingsIndex;
    cache.ageFrameIndex = ageFrameIndex;
}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    personnelId,
    cache,
}) => {
    var { type: messageType, payload } = message;
    var { 
        id,
        lastKnownEventId,
        customRecordType,
        ageFrame,
        props,
    } = payload;

    var channel = (
        rohrpost
        .openCollection('study')
        .openChannel({
            id,
        })
    );

    var i = cache.settingsIndex;
    var j = cache.ageFrameIndex;
    var path = `/state/selectionSettingsBySubjectType/${i}/conditionsByAgeFrame/${j}/conditions`;

    var messages = PushMaker({ personnelId }).all({
        [path]: props,
    });

    await channel.dispatchMany({ messages, lastKnownEventId });
}

module.exports = handler;
