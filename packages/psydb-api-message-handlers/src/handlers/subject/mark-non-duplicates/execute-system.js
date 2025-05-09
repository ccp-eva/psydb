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

        await dispatch({
            collection: 'subject', channelId: it, subChannelKey: 'scientific',
            payload: { $push: {
                'scientific.state.internals.nonDuplicateIds': { $each: (
                    nonDuplicateIds
                )}
            }}
        });
    }
}

module.exports = { executeSystemEvents }
