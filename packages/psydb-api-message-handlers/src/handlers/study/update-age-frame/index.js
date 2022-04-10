'use strict';
// TODO: redesign this to gtet the whole conditions object
var debug = require('debug')('psydb:api:message-handlers');

var { ApiError } = require('@mpieva/psydb-api-lib');
var { SimpleHandler } = require('../../../lib');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'study/update-age-frame',
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
        originalAgeFrame,
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

    var originalConditionsByAgeFrameIndex = undefined;
    conditionsByAgeFrame.forEach((it, index) => {
        // find original index
        if (
            it.ageFrame.start === originalAgeFrame.start
            && it.ageFrame.end === originalAgeFrame.end
        ) {
            originalConditionsByAgeFrameIndex = index;
        }
        else {
            // check if new age frame is duplicate
            if (
                it.ageFrame.start === ageFrame.start
                && it.ageFrame.end === ageFrame.end
            ) {
                 throw new ApiError(400, 'DuplicateAgeFrame');
            }
        }
    });

    cache.settingsIndex = settingsIndex;
    cache.originalConditionsByAgeFrameIndex = (
        originalConditionsByAgeFrameIndex
    )
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
        customRecordType,
        props,
    } = payload;

    var {
        ageFrame,
        conditions,
    } = props;

    var si = cache.settingsIndex;
    var ci = cache.originalConditionsByAgeFrameIndex;
    var path = (
        `state.selectionSettingsBySubjectType.${si}` + 
        `.conditionsByAgeFrame.${ci}`
    );

    await dispatch({
        collection: 'study',
        channelId: id,
        payload: { $set: {
            [path]: {
                ageFrame,
                conditions,
            },
        }}
    });
}

module.exports = handler;
