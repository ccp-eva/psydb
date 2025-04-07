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
        db.collection('subject').findOne(
            { _id: id },
        )
    );
    if (!record) {
        throw new ApiError(404)
    }
    
    var { scientific, gdpr } = record;

    var eventIds = [
        ...gdpr._rohrpostMetadata.eventIds,
        ...scientific._rohrpostMetadata.eventIds,
    ];

    var events = await withRetracedErrors(
        aggregateToArray({ db, rohrpostEvents: [
            { $match: {
                _id: { $in: eventIds }
            }},
        ]})
    );

    var tieBreaker = eventIds.map(String).reverse();

    var eventChain = events.sort((a, b) => {
        var deltaT = a.timestamp.getTime() - b.timestamp.getTime();
        if (deltaT === 0) {
            return (
                tieBreaker.indexOf(String(a._id)) 
                - tieBreaker.indexOf(String(b._id))
            );
        }
        else {
            return deltaT;
        }
    });

    var spooled = spoolEvents({ events: eventChain })

    context.body = ResponseBody({
        data: { record, spooled, eventChain }
    });

    await next();
}

module.exports = readSpooled;
