'use strict';
// TODO: redesign this to gtet the whole conditions object
var debug = require('debug')('psydb:api:message-handlers');

var { copy } = require('copy-anything');
var { Ajv, ApiError } = require('@mpieva/psydb-api-lib');

var BaseSchema = require('./base-schema');
var FullSchema = require('./full-schema');

var handler = {};

handler.shouldRun = (message) => (
    message.type === 'study/update-subject-type-base-settings'
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
    message,
    cache,

    dispatch
}) => {
    // TODO
    if (!permissions.hasRootAccess) {
        //throw new ApiError(403);
    }

    var {
        id,
        customRecordType,
        enabledOnlineTesting,
        subjectsPerExperiment
    } = message.payload;

    var study = await (
        db.collection('study')
        .findOne({ _id: id })
    );

    if (!study) {
        throw new ApiError(404, 'StudyNotFound');
    }

    var { selectionSettingsBySubjectType } = study.state;

    var settingsIndex = undefined;
    for (var [index, it] of selectionSettingsBySubjectType.entries()) {
        if (it.subjectRecordType === customRecordType) {
            settingsIndex = index;
            break;
        }
    }

    if (settingsIndex === undefined) {
        throw new ApiError(400, 'InvalidSubjectRecordType');
    }

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
        customRecordType,
        enableOnlineTesting,
        subjectsPerExperiment,
        externalLocationGrouping,
    } = payload;

    var si = cache.settingsIndex;
    var path = `state.selectionSettingsBySubjectType.${si}`;

    await dispatch({
        collection: 'study',
        channelId: id,
        payload: { $set: {
            [`${path}.enableOnlineTesting`]: enableOnlineTesting,
            [`${path}.subjectsPerExperiment`]: subjectsPerExperiment,
            [`${path}.externalLocationGrouping`]: externalLocationGrouping,
        }}
    });
}

handler.triggerOtherSideEffects = async () => {};

module.exports = handler;
