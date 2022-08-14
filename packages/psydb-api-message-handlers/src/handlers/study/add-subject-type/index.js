'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { copy } = require('copy-anything');
var {
    Ajv,
    ApiError,
    compareIds
} = require('@mpieva/psydb-api-lib');

var BaseSchema = require('./base-schema');
var FullSchema = require('./full-schema');

var handler = {};

handler.shouldRun = (message) => (
    message.type === 'study/add-subject-type'
)

handler.checkSchema = async ({ db, message }) => {
    var ajv = Ajv(),
        isValid = false;

    var precheckMessage = copy(message);
    isValid = ajv.validate(BaseSchema(), precheckMessage);
    if (!isValid) {
        debug('ajv errors', ajv.errors);
        throw new ApiError(400, 'InvalidMessageSchema');
    }

    var {
        customRecordType
    } = precheckMessage;

    var subjectTypeData = await (
        db.collection('customRecordType').findOne({
            collection: 'subject',
            type: customRecordType
        }, { projection: { events: false }})
    );

    if (!subjectTypeData) {
        if (!study) {
            throw new ApiError(400, 'InvalidCustomRecordType');
        }
    }

    var subjectRecordTypeScientificFields = (
        subjectTypeData.state.settings.subChannelFields.scientific
    );

    isValid = ajv.validate(FullSchema({
        subjectRecordTypeScientificFields,
    }), message);
    if (!isValid) {
        debug('ajv errors', ajv.errors);
        throw new ApiError(400, 'InvalidMessageSchema');
    }
}

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
        customRecordType,
    } = message.payload;

    var study = await (
        db.collection('study')
        .findOne({ _id: id })
    );

    if (!study) {
        throw new ApiError(404, 'StudyNotFound');
    }

    var customRecordTypeRecord = await (
        db.collection('customRecordType')
        .findOne({ type: customRecordType })
    );

    if (!customRecordTypeRecord) {
        throw new ApiError(400, 'InvalidSubjectRecordType');
    }

    if (customRecordTypeRecord.collection !== 'subject') {
        throw new ApiError(400, 'InvalidSubjectRecordType');
    }

    study.state.selectionSettingsBySubjectType.forEach(it => {
        if (it.subjectRecordType === customRecordType) {
            throw new ApiError(400, 'DuplicateSubjectRecordType')
        }
    })

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
        customRecordType,
        enableOnlineTesting,
        externalLocationGrouping,
    } = payload;

    await dispatch({
        collection: 'study',
        channelId: id,
        payload: { $push: {
            'state.selectionSettingsBySubjectType': {
                subjectRecordType: customRecordType,
                generalConditions: [],
                conditionsByAgeFrame: [],
                enableOnlineTesting: enableOnlineTesting || false,
                externalLocationGrouping: (
                    externalLocationGrouping || { enabled: false }
                ),
            },
        }}
    });
}

handler.triggerOtherSideEffects = async () => {};

module.exports = handler;
