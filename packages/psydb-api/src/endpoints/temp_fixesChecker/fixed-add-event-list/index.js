'use strict';
var { unescape } = require('@cdxoo/mongodb-escape-keys');
var { forcePush } = require('@mpieva/psydb-core-utils');

var {
    validateOrThrow,
    ResponseBody,
    withRetracedErrors,
    aggregateToArray,
    mappifyPointer,
    fetchRecordLabelsManual,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');

var fixedAddEventList = async (context, next) => {
    var { db, permissions, request } = context;

    validateOrThrow({
        schema: Schema(),
        payload: request.body
    })

    var {
        offset,
        limit,
    } = request.body;

    var total = await (
        db.collection('temp_fixParticipationUpdates').count({
            source: 'fixAddEvents'
        })
    );

    var updates = await withRetracedErrors(
        aggregateToArray({ db, temp_fixParticipationUpdates: [
            { $match: {
                source: 'fixAddEvents'
            }},
            { $skip: offset },
            { $limit: limit },
        ]})
    )

    var relatedIds = {};
    for (var u of updates) {
        var { ops } = u;
        
        for (var o of ops) {
            o.args = o.args.map(a => unescape(a, { traverseArray: true }))
        }

        for (var o of ops) {
            var { collection, args } = o;
            if (collection === 'rohrpostEvents') {
                continue;
            }

            forcePush({
                into: relatedIds,
                pointer: `/${collection}`,
                values: [ args[0]._id ]
            })
        }
    }

    var related = await fetchRecordLabelsManual(db, relatedIds);

    context.body = ResponseBody({
        data: { updates, total, related },
    });
}

module.exports = { fixedAddEventList };
