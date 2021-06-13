'use strict';
// TODO: redesign this to gtet the whole conditions object
var debug = require('debug')('psydb:api:message-handlers');

var nanoid = require('nanoid').nanoid;

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    compareIds = require('@mpieva/psydb-api-lib/src/compare-ids'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv');

var PutMaker = require('../../../lib/put-maker');

var BaseSchema = require('./base-schema');
var FullSchema = require('./full-schema');

var handler = {};

handler.shouldRun = (message) => (
    message.type === 'study/update-subject-type-base-settings'
)

handler.checkSchema = async ({ db, message }) => {
    var ajv = Ajv(),
        isValid = false;

    isValid = ajv.validate(BaseSchema(), message);
    if (!isValid) {
        debug('ajv errors', ajv.errors);
        throw new ApiError(400, 'InvalidMessageSchema');
    }

    var {
        customRecordType
    } = message.payload;

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
}) => {
    // TODO
    if (!permissions.hasRootAccess) {
        throw new ApiError(403);
    }

    var {
        id,
        lastKnownEventId,
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

    if (!compareIds(study.events[0]._id, lastKnownEventId)) {
        throw new ApiError(400, 'RecordHasChanged');
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
        lastKnownEventId,
        customRecordType,
        enableOnlineTesting,
        subjectsPerExperiment,
        externalLocationGrouping,
    } = payload;

    var channel = (
        rohrpost
        .openCollection('study')
        .openChannel({
            id,
        })
    );

    var si = cache.settingsIndex;
    var path = `/state/selectionSettingsBySubjectType/${si}`;

    var messages = PutMaker({ personnelId }).all({
        [`${path}/enableOnlineTesting`]: enableOnlineTesting,
        [`${path}/subjectsPerExperiment`]: subjectsPerExperiment,
        [`${path}/externalLocationGrouping`]: externalLocationGrouping,
    });

    await channel.dispatchMany({ messages, lastKnownEventId });
}

handler.triggerOtherSideEffects = async () => {};

module.exports = handler;
