'use strict';
var { unescape } = require('@cdxoo/mongodb-escape-keys');

var {
    validateOrThrow,
    ResponseBody,
    withRetracedErrors,
    aggregateToArray,
    mappifyPointer,
    fetchRecordLabelsManual,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');

var mapArgIds = ({ ops, collection }) => (
    ops
    .filter(it => it.collection === collection)
    .map(it => it.args[0]._id)
)

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

    for (var u of updates) {
        var { ops } = u;
        for (var o of ops) {
            o.args = o.args.map(a => unescape(a, { traverseArray: true }))
        }

        //u.experimentIds = filterMap({ from: ops, lambda: (it) => ([
        //    it.collection === 'experiment',
        //    it.args[0]._id
        //])})
       
        u.experimentIds = mapArgIds({ ops, collection: 'experiment' });
        u.subjectIds = mapArgIds({ ops, collection: 'subject' });
    }

    var fromItems = mappifyPointer(updates);
    var related = await fetchRecordLabelsManual(db, {
        experiment: fromItems('/experimentIds').flat(),
        subject: fromItems('/subjectIds').flat()
    });

    context.body = ResponseBody({
        data: { updates, total, related },
    });
}

module.exports = { fixedAddEventList };
