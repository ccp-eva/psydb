'use strict';
var { keyBy, ejson } = require('@mpieva/psydb-core-utils');
var { spoolEvents } = require('@mpieva/psydb-rohrpost-utils');

var {
    ApiError,
    ResponseBody,
    withRetracedErrors,
    validateOrThrow,
    aggregateToArray
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');


var readSpooled = async (context, next) => {
    var { db, request, permissions } = context;

    if (!permissions.isRoot()) {
        throw new ApiError(403)
    }

    validateOrThrow({
        schema: Schema(),
        payload: request.body
    });

    var { id } = request.body;
    
    var record = await withRetracedErrors(
        db.collection('experiment').findOne(
            { _id: id },
        )
    );
    if (!record) {
        throw new ApiError(404)
    }
    
    var { _rohrpostMetadata: { eventIds }} = record;

    var events = await withRetracedErrors(
        aggregateToArray({ db, rohrpostEvents: [
            { $match: {
                _id: { $in: eventIds }
            }}
        ]})
    );

    var eventsById = keyBy({
        items: events,
        byProp: '_id'
    });

    var eventChain = eventIds.map(it => eventsById[it]).reverse();
    var spooled = spoolEvents({ events: eventChain })

    context.body = ResponseBody({
        data: { record, spooled, eventChain }
    });

    await next();
}

module.exports = readSpooled;
