'use strict';
var { unescape } = require('@cdxoo/mongodb-escape-keys');

var {
    validateOrThrow,
    ResponseBody,
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

    var updates = await (
        db.collection('temp_fixParticipationUpdates').aggregate([
            { $match: {
                source: 'fixAddEvents'
            }},
            { $skip: offset },
            { $limit: limit },
        ])
    ).toArray();

    for (var u of updates) {
        var { ops } = u;
        for (var o of ops) {
            o.args = o.args.map(a => unescape(a, { traverseArray: true }))
        }
    }

    context.body = ResponseBody({
        data: { updates, total },
    });
}

module.exports = { fixedAddEventList };
