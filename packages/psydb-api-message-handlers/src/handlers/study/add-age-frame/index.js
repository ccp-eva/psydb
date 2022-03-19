'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { ApiError } = require('@mpieva/psydb-api-lib');
var { SimpleHandler } = require('../../../lib');

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

    dispatch,
}) => {
    var { type: messageType, payload } = message;
    var { 
        id,
        customRecordType,
        props,
    } = payload;

    var {
        ageFrame,
        conditions,
    } = props;

    var i = cache.settingsIndex;
    var path = `state.selectionSettingsBySubjectType.${i}.conditionsByAgeFrame`;

    await dispatch({
        collection: 'study',
        channelId: id,
        payload: { $push: {
            [path]: {
                ageFrame,
                conditions,
            },
        }}
    });

}

module.exports = handler;
