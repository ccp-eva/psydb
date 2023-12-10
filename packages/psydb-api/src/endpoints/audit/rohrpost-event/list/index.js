'use strict';
var { forcePush, escapeRX } = require('@mpieva/psydb-core-utils');
var {
    validateOrThrow,
    ResponseBody,
    withRetracedErrors,
    aggregateToArray,
    fetchRecordLabelsManual,
    SmartArray,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');

var listEndpoint = async (context, next) => {
    var { db, permissions, request } = context;

    validateOrThrow({
        schema: Schema(),
        payload: request.body
    })

    var {
        eventId,
        correlationId,
        triggeredBy,
        interval,

        channelId,
        collectionName,

        offset,
        limit
    } = request.body;

    var AND = SmartArray([
        eventId && { $regexMatch: {
            input: '$_id',
            regex: new RegExp(escapeRX(eventId), 'i')
        }},
        correlationId && { $regexMatch: {
            input: '$correlationId',
            regex: new RegExp(escapeRX(correlationId), 'i')
        }},
        triggeredBy && { $eq: [
            '$messgae.payload.personnelId', triggeredBy,
        ]},
        // interval && { ... } // TODO

        channelId && { $regexMatch: {
            input: { $toString: '$channelId' },
            regex: new RegExp(escapeRX(channelId))
        }},
        collectionName && { $regexMatch: {
            input: '$collectionName',
            regex: new RegExp(escapeRX(collectionName), 'i')
        }},
    ]);

    var MATCH = (
        AND.length > 0
        ? { $expr: { $and: AND }}
        : undefined
    );

    var total = await withRetracedErrors(
        db.collection('rohrpostEvents').countDocuments(MATCH)
    );

    var records = await withRetracedErrors(
        aggregateToArray({ db, rohrpostEvents: SmartArray([
            MATCH && { $match: MATCH },
            { $skip: offset },
            { $limit: limit  }
        ])})
    );

    var relatedChannelIds = {};
    for (var it of records) {
        forcePush({
            into: relatedChannelIds,
            pointer: `/${it.collectionName}`,
            values: [ it.channelId ]
        })
    }

    var related = await fetchRecordLabelsManual(db, {
        personnel: records.map(it => it.message.personnelId),
        //...relatedChannelIds // TODO
    });

    context.body = ResponseBody({
        data: { records, total, related },
    });
}

module.exports = listEndpoint;
