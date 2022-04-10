'use strict';
// TODO: obsolete
var debug = require('debug')('psydb:api:message-handlers');

var {
    ApiError,
} = require('@mpieva/psydb-api-lib');

var {
    SimpleHandler,
} = require('../../../lib');

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

    dispatch,
}) => {
    var { type: messageType, payload } = message;
    var {
        id,
        subjectType,
        locationFieldKey,
    } = payload;

    await dispatch({
        collection: 'study',
        channelId: id,
        payload: { $push: {
            'state.externalTestLocationFields': {
                subjectType,
                locationFieldKey,
            },
        }}
    })
}

module.exports = handler;
