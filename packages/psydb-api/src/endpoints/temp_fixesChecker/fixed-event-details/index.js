'use strict';
var { unescape } = require('@cdxoo/mongodb-escape-keys');
var { ejson, forcePush } = require('@mpieva/psydb-core-utils');

var {
    validateOrThrow,
    ResponseBody,
    fetchRecordLabelsManual,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');


var fixedEventDetails = async (context, next) => {
    var { db, permissions, request } = context;

    validateOrThrow({
        schema: Schema(),
        payload: request.body
    })

    var {
        updateId
    } = request.body;
   
    var update = await (
        db.collection('temp_fixParticipationUpdates').findOne({
            _id: updateId
        })
    );

    for (var o of update.ops) {
        o.args = o.args.map(a => unescape(a, { traverseArrays: true }))
    }

    var relatedIds = {};
    for (var o of update.ops) {
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

    var related = await fetchRecordLabelsManual(db, relatedIds);

    context.body = ResponseBody({
        data: { update, related },
    });
}

module.exports = { fixedEventDetails };
