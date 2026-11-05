'use strict';
var { withRetracedErrors } = require('@mpieva/psydb-api-lib');

var executeSystemEvents = async (context) => {
    var { db, dispatch, message, personnelId, now } = context;
    var { _id } = message.payload;

    await withRetracedErrors(
        db.collection('personnelShadow').updateOne({ _id }, { $set: {
            'setAt': now,
            'setBy': personnelId,
            'passwordHash': '[[REDACTED]]',
        }})
    );

    await dispatch.makeClean({
        collection: 'personnel',
        channelId: _id, subChannelKey: 'gdpr',
    });
}

module.exports = { executeSystemEvents }
