'use strict';
var {
    withRetracedErrors,
    aggregateToArray,
} = require('@mpieva/psydb-api-lib');

var fetchEvents = async (bag) => {
    var { db, updates } = bag;

    var eventIds = [];
    for (var u of updates) {
        var { ops } = u;
        for (var o of ops) {
            if (o.collection === 'rohrpostEvents') {
                eventIds.push(o.args[0]._id)
            }
        }
    }

    var events = await withRetracedErrors(
        aggregateToArray({ db, rohrpostEvents: [
            { $match: {
                _id: { $in: eventIds }
            }},
            { $project: {
                collectionName: true,
                channelId: true,
            }}
        ]})
    );

    return events;
}

module.exports = { fetchEvents }
