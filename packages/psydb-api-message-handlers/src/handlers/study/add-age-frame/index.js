'use strict';
// TODO: redesign this to gtet the whole conditions object
var debug = require('debug')('psydb:api:message-handlers');

var nanoid = require('nanoid').nanoid;

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    compareIds = require('@mpieva/psydb-api-lib/src/compare-ids');

var SimpleHandler = require('../../../lib/simple-handler'),
    PushMaker = require('../../../lib/push-maker');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'study/add-age-frame',
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
        //throw new ApiError(403);
    }

    var {
        id,
        lastKnownEventId,
        customRecordType,
        props,
    } = message.payload;

    var {
        ageFrame,
        conditions,
    } = props;

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

    conditionsByAgeFrame.forEach((it, index) => {
        if (
            it.ageFrame.start === ageFrame.start
            && it.ageFrame.end === ageFrame.end
        ) {
             throw new ApiError(400, 'DuplicateAgeFrame');
        }
    });

    cache.settingsIndex = settingsIndex;
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
        props,
    } = payload;

    var {
        ageFrame,
        conditions,
    } = props;

    var channel = (
        rohrpost
        .openCollection('study')
        .openChannel({
            id,
        })
    );

    var i = cache.settingsIndex;
    var path = `/state/selectionSettingsBySubjectType/${i}/conditionsByAgeFrame`;

    var messages = PushMaker({ personnelId }).all({
        [path]: {
            ageFrame,
            conditions,
        },
    });

    await channel.dispatchMany({ messages, lastKnownEventId });
}

module.exports = handler;
