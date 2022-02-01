'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { compareIds } = require('@mpieva/psydb-core-utils');
var { ApiError, Ajv } = require('@mpieva/psydb-api-lib');
var { PutMaker } = require('../../../lib/');

var createSchema = require('./schema');

var shouldRun = ({ type }) => (
    type === 'custom-record-types/set-general-data'
);

var checkSchema = async (context) => {
    var { db, permissions, cache, message } = context;
    
    var ajv = Ajv();
    var isValid = false;
    
    isValid = ajv.validate(createSchema({ isPrecheck: true }), message);
    if (!isValid) {
        debug('ajv errors', message.type, ajv.errors);
        throw new ApiError(400, {
            apiStatus: 'InvalidMessageSchema',
            data: { ajvErrors: ajv.errors },
        });
    }
  
    var { id } = message.payload;
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
    var { id, lastKnownEventId, label, reservationType } = message.payload;
    var { record } = cache;

    if (!permissions.hasRootAccess) {
        //throw new ApiError(403);
    }
    
    if (!compareIds(record.events[0]._id, lastKnownEventId)) {
        throw new ApiError(400, 'RecordHasChanged');
    }

}

var triggerSystemEvents = async (context) => {
    var { rohrpost, cache, personnelId, message } = context;
    var { id, lastKnownEventId, label, reservationType } = message.payload;
    var { record } = cache;
    var { collection } = record;
    
    var channel = (
        rohrpost
        .openCollection('customRecordType')
        .openChannel({
            id
        })
    );

    await channel.dispatchMany({
        lastKnownEventId,
        messages: PutMaker({ personnelId }).all({
            '/state/label': label,
            ...(collection === 'location' && {
                '/state/reservationType': reservationType
            })
        })
    })
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
