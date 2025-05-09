'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { copy } = require('copy-anything');
var { merge } = require('@mpieva/psydb-core-utils');
var { ApiError, Ajv } = require('@mpieva/psydb-api-lib');

var createSchema = require('./schema');

var shouldRun = ({ type }) => (
    type === 'custom-record-types/set-general-data'
);

var checkSchema = async (context) => {
    var { db, permissions, cache, message } = context;
    
    var ajv = Ajv();
    var isValid = false;
   
    var precheckMessage = copy(message);
    isValid = ajv.validate(
        createSchema({ isPrecheck: true }),
        precheckMessage
    );
    if (!isValid) {
        debug('ajv errors', message.type, ajv.errors);
        throw new ApiError(400, {
            apiStatus: 'InvalidMessageSchema',
            data: { ajvErrors: ajv.errors },
        });
    }
  
    var { id } = precheckMessage.payload;
    var record = await (
        db.collection('customRecordType')
        .findOne({ _id: id })
    );
    if (!record) {
        throw new ApiError(404, 'RecordNotFound');
    }

    var { collection } = record;
    isValid = ajv.validate(createSchema({ collection }), message);
    if (!isValid) {
        debug('ajv errors', message.type, ajv.errors);
        throw new ApiError(400, {
            apiStatus: 'InvalidMessageSchema',
            data: { ajvErrors: ajv.errors },
        });
    }

    cache.record = record;
}

var checkAllowedAndPlausible = async (context) => {
    var { db, permissions, cache, message } = context;
    var { id, label, reservationType } = message.payload;
    var { record } = cache;

    if (!permissions.isRoot()) {
        throw new ApiError(403);
    }
    
}

var triggerSystemEvents = async (context) => {
    var { rohrpost, cache, personnelId, message, dispatch } = context;
    var {
        id,
        label,
        displayNameI18N = {},
        reservationType,
        requiresTestingPermissions,
        commentFieldIsSensitive,
        showSequenceNumber,
        showOnlineId,
        
        enableSubjectSelectionSettings,
        enableLabTeams,
    } = message.payload;

    var { record } = cache;
    var { collection } = record;
  
    // TODO push/pull testinPermissions/sequenceNumber/onlineId
    // in form order
    
    var formOrderUpdates = merge(
        maybeUpdateFormOrder(record, '/sequenceNumber', showSequenceNumber),
        maybeUpdateFormOrder(record, '/onlineId', showOnlineId),
        maybeUpdateFormOrder(record, '/scientific/state/testingPermissions', requiresTestingPermissions)
    );

    //console.log(record.state.formOrder);
    //console.log(formOrderUpdates);
    
    await dispatch({
        collection: 'customRecordType',
        channelId: id,
        payload: {
            $set: {
                'state.label': label,
                'state.displayNameI18N': displayNameI18N,
                ...(collection === 'subject' && {
                    'state.requiresTestingPermissions': requiresTestingPermissions,
                    'state.commentFieldIsSensitive': commentFieldIsSensitive,
                    'state.showSequenceNumber': showSequenceNumber,
                    'state.showOnlineId': showOnlineId,
                }),
                ...(collection === 'location' && {
                    'state.reservationType': reservationType
                }),
                ...(collection === 'study' && {
                    'state.enableSubjectSelectionSettings': (
                        enableSubjectSelectionSettings
                    ),
                    'state.enableLabTeams': enableLabTeams
                })
            },
            ...formOrderUpdates
        },
    });
}

var maybeUpdateFormOrder = (record, key, flag) => {
    // FIXME: initialize form order empty [] on create?
    if (record.state.formOrder?.includes(key) && !flag) {
        return { $pull: { 'state.formOrder': { $in: [ key ] }}}
    }
    else if (!record.state.formOrder?.includes(key) && flag) {
        return { $push: { 'state.formOrder': { $each: [ key ] }}}
    }
    else {
        return {}
    }
}

// no-op
var triggerOtherSideEffects = async () => {};

module.exports = {
    shouldRun,
    checkSchema,
    checkAllowedAndPlausible,
    triggerSystemEvents,
    triggerOtherSideEffects,
}
