'use strict';
var debug = require('debug')('psydb:api:message-handlers');
var { pathify } = require('@mpieva/psydb-core-utils');

var {
    ApiError,
    validateOrThrow,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');

var __createHandler = () => ({
    shouldRun,
    checkSchema,
    checkAllowedAndPlausible,
    triggerSystemEvents,
    triggerOtherSideEffects
});

var shouldRun = (message) => (
    message.type === 'subjectGroup/patch'
)

var checkSchema = async (context) => {
    var { message } = context;
    
    validateOrThrow({
        schema: Schema(),
        payload: message
    });
} 

var checkAllowedAndPlausible = async (context) => {
    var { db, permissions, message, cache } = context;
    var { subjectType, props: {
        locationId,
    }} = message.payload;

    if (!permissions.hasCollectionFlag('subjectGroup', 'write')) {
        throw new ApiError(403);
    }
    
    var location = await db.collection('location').findOne({
        _id: locationId
    }, { projection: { type: true }});
    if (!location) {
        throw new ApiError(400); // TODO
    }

    cache.locationType = location.type;
}

var triggerSystemEvents = async (context) => {
    var { dispatch, message, cache } = context;
    var { id, props } = message.payload;
    var { locationType } = cache;
    
    await dispatch({
        collection: 'subjectGroup',
        channelId: id,
        payload: { $set: (
            pathify({ locationType, ...props }, { prefix: 'state' })
        )}
    })
}

var triggerOtherSideEffects = async () => {};

module.exports = __createHandler();
