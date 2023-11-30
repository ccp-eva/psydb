'use strict';
var { unescape } = require('@cdxoo/mongodb-escape-keys');
var { ejson } = require('@mpieva/psydb-core-utils');

var {
    validateOrThrow,
    ResponseBody,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');


var fixedAddEventDetails = async (context, next) => {
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

    for (var op of update.ops) {
        op.args = op.args.map(a => unescape(a, { traverseArrays: true }))
    }

    console.dir(ejson(update), { depth: null });

    context.body = ResponseBody({
        data: { update },
    });
}

module.exports = { fixedAddEventDetails };
