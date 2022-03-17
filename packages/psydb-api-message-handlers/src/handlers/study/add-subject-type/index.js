'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var nanoid = require('nanoid').nanoid;

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    compareIds = require('@mpieva/psydb-api-lib/src/compare-ids'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv');

var PushMaker = require('../../../lib/push-maker');

var BaseSchema = require('./base-schema');
var FullSchema = require('./full-schema');

var handler = {};

handler.shouldRun = (message) => (
    message.type === 'study/add-subject-type'
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
    message
}) => {
    // TODO
    if (!permissions.hasRootAccess) {
        //throw new ApiError(403);
    }

    var {
        id,
        lastKnownEventId,
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
}) => {
    var { type: messageType, payload } = message;
    var {
        id,
        lastKnownEventId,
        customRecordType,
        enableOnlineTesting,
        externalLocationGrouping,
    } = payload;

    var channel = (
        rohrpost
        .openCollection('study')
        .openChannel({
            id,
        })
    );

    var messages = PushMaker({ personnelId }).all({
        // NOTE: this structure has to exist so we can push into the
        // nested arrays
        '/state/selectionSettingsBySubjectType': {
            subjectRecordType: customRecordType,
            generalConditions: [],
            conditionsByAgeFrame: [],
            enableOnlineTesting: enableOnlineTesting || false,
            externalLocationGrouping: (
                externalLocationGrouping || { enabled: false }
            ),
        },
    });

    await channel.dispatchMany({ messages, lastKnownEventId });
}

handler.triggerOtherSideEffects = async () => {};

module.exports = handler;
