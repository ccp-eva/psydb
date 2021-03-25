'use strict';
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
        customRecordTypeId,
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

    var subjectTypeSettings = study.state.subjectTypeSettings;

    var ageFrameSettings = undefined,
        subjectTypeSettingsIndex = undefined;
    for (var [index, it] of subjectTypeSettings.entries()) {
        if (compareIds(it.customRecordTypeId, customRecordTypeId)) {
            ageFrameSettings = it.ageFrameSettings;
            subjectTypeSettingsIndex = index;
            break;
        }
    }

    var conditionList = undefined,
        ageFrameSettingsIndex = undefined;
    for (var [index,it] of ageFrameSettings.entries()) {
        if (
            it.ageFrame.start === ageFrame.start
            && it.ageFrame.end === ageFrame.end
        ) {
            conditionList = it.conditionList;
            ageFrameSettingsIndex = index;
            break;
        }
    };

    for (var it of conditionList) {
        if (it.field === props.field) {
             throw new ApiError(400, 'DuplicateConditionField');
        }
    }

    cache.subjectTypeSettingsIndex = subjectTypeSettingsIndex;
    cache.ageFrameSettingsIndex = ageFrameSettingsIndex;
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
        customRecordTypeId,
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

    var path = `/state/subjectTypeSettings/${cache.subjectTypeSettingsIndex}/ageFrameSettings/${cache.ageFrameSettingsIndex}/conditionList`;

    var messages = PushMaker({ personnelId }).all({
        [path]: props,
    });

    await channel.dispatchMany({ messages, lastKnownEventId });
}

module.exports = handler;
