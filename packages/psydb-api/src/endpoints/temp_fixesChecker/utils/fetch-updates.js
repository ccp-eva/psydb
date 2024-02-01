'use strict';
var { unescape } = require('@cdxoo/mongodb-escape-keys');

var {
    withRetracedErrors,
    aggregateToArray,
} = require('@mpieva/psydb-api-lib');

var fetchUpdates = async (bag) => {
    var { db, match, offset, limit } = bag;

    var total = await (
        db.collection('temp_fixParticipationUpdates').countDocuments({
            ...match
        })
    );

    var updates = await withRetracedErrors(
        aggregateToArray({ db, temp_fixParticipationUpdates: [
            { $match: {
                ...match
            }},
            { $skip: offset },
            { $limit: limit },
        ]})
    )

    for (var u of updates) {
        for (var o of u.ops) {
            o.args = o.args.map(a => unescape(a, { traverseArray: true }))
        }
    }

    return { updates, total }
}

module.exports = { fetchUpdates }
