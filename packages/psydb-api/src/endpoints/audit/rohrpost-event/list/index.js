'use strict';
var { ObjectId } = require('mongodb');
var { keyBy, forcePush, escapeRX } = require('@mpieva/psydb-core-utils');
var {
    validateOrThrow,
    ResponseBody,
    withRetracedErrors,
    aggregateToArray,
    fetchRecordLabelsManual,
    SmartArray,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');

var maybeAsObjectId = (that) => {
    var out = undefined;
    try {
        if (String(that).length === 24) {
            out = new ObjectId(that);
        }
    }
    catch (e) {}

    return out;
}

var maybeAsNanoid = (that) => {
    var out = undefined
    if (String(that).length === 21) {
        out = that;
    }
    return out;
}

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

    var channelObjectId = maybeAsObjectId(channelId);
    var correlationNanoId = maybeAsNanoid(correlationId);

    var AND = SmartArray([
        eventId && { $regexMatch: {
            input: '$_id',
            regex: new RegExp(escapeRX(eventId), 'i')
        }},
        correlationNanoId ? (
            { $eq: [ '$correlationId', correlationNanoId ]}
        ) : (
            correlationId && { $regexMatch: {
                input: '$correlationId',
                regex: new RegExp(escapeRX(correlationId), 'i')
            }}
        ),
        triggeredBy && { $eq: [
            '$message.personnelId', triggeredBy,
        ]},
        // interval && { ... } // TODO

        channelObjectId ? (
            { $eq: [ '$channelId', channelObjectId ]}
        ) : (
            channelId && { $regexMatch: {
                input: { $toString: '$channelId' },
                regex: new RegExp(escapeRX(channelId))
            }}
        ),

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

    var messages = await withRetracedErrors(
        aggregateToArray({ db, mqMessageHistory: [
            { $match: {
                _id: { $in: records.map(it => it.correlationId )}
            }},
            { $project: {
                '_id': true,
                'messageType': '$message.type'
            }}
        ]})
    );

    var messagesById = keyBy({
        items: messages, byProp: '_id'
    });

    var relatedChannelIds = {};
    for (var it of records) {
        it._messageType = messagesById[it.correlationId].messageType;

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
