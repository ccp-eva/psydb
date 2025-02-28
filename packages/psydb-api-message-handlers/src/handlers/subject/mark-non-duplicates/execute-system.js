'use strict';
var { prefixify } = require('@mpieva/psydb-core-utils');
var { compareIds } = require('@mpieva/psydb-common-lib');
var { withRetracedErrors } = require('@mpieva/psydb-api-lib');
// FIXME
//var { openChannel } = require('../../../lib/generic-record-handler-utils');


var executeSystemEvents = async (context) => {
    var {
        db, rohrpost, message, cache, personnelId,
        dispatch, dispatchProps
    } = context;

    var { subjectIds } = message.payload;

    for (var it of subjectIds) {
        var nonDuplicateIds = [];
        for (var other of subjectIds) {
            if (!compareIds(it, other)) {
                nonDuplicateIds.push(other)
            }
        }

        await withRetracedErrors(
            db.collection('subject').updateOne(
                { '_id': it },
                { $set: prefixify({
                    values: { nonDuplicateIds }, 
                    prefix: 'scientific.state.internals'
                })},
            )
        );
    }
}

module.exports = { executeSystemEvents }
