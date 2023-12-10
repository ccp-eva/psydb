'use strict';
var { forcePush } = require('@mpieva/psydb-core-utils');
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
        correlationId,
        triggeredBy,
        interval,

        channelId,
        collectionName,

        offset,
        limit
    } = request.body;

    var AND = SmartArray([
        correlationId && { correlationId: {
            $regex: new RegExp(correlationId)
        }},
        triggeredBy && {
            'payload.personnelId': triggeredBy,
        },
        // interval && { ... } // TODO

        channelId && {
            $regexMatch: {
                input: { $toString: '$channelId' },
                regex: new RegExp(channelId)
            }
        },
        collectionName && { collectionName: {
            $regex: new RegExp(collectionName, 'i')
        }}
    ])

    var MATCH = (
        AND.length > 0
        ? { $expr: { $and: AND }}
        : undefined
    );

    var total = await withRetracedErrors(
        db.collection('rohrpostEvents').countDocuments(MATCH)
    );

    var records = await withRetracedErrors(
        aggregateToArray({ db, mqMessageHistory: SmartArray([
            MATCH && { $match: MATCH },
            { $skip: offset },
            { $limit: limit  }
        ])})
    );

    var relatedChannelIds = {};
    for (var it of records) {
        forcePush(relatedChannelIds, `/${it.collectionName}`, it.channelId)
    }

    var related = await fetchRecordLabelsManual(db, {
        personnel: records.map(it => it.payload.personnelId),
        ...relatedChannelIds
    });

    context.body = ResponseBody({
        data: { records, related },
    });
}

module.exports = listEndpoint;
