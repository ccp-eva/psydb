'use strict';
var { keyBy, forcePush } = require('@mpieva/psydb-core-utils');

var postprocessUpdates = (bag) => {
    var { updates, events } = bag;

    var eventsById = keyBy({ items: events, byProp: '_id' });

    var relatedIds = {};
    for (var u of updates) {
        var { ops } = u;
        for (var o of ops) {
            var { collection, args } = o;

            if (o.collection === 'rohrpostEvents') {
                var event = eventsById[args[0]._id];
                var { collectionName, channelId } = event;

                forcePush({
                    into: relatedIds,
                    pointer: `/${collectionName}`,
                    values: [ channelId ]
                })

                o.event = event;
            }
            else {
                forcePush({
                    into: relatedIds,
                    pointer: `/${collection}`,
                    values: [ args[0]._id ]
                })
            }
        }
    }

    return { relatedIds };
}

module.exports = { postprocessUpdates }
