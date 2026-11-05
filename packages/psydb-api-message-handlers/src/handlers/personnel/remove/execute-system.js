'use strict';
var { withRetracedErrors } = require('@mpieva/psydb-api-lib');

var executeSystemEvents = async (context) => {
    var { db, dispatch, message, now } = context;
    var { _id } = message.payload;

    await withRetracedErrors(
        db.collection('personnelShadow').deleteOne({ _id })
    );

    await dispatch.makeMrproperMultiplexed({
        collection: 'personnel', channelIds: [ _id ], now
    });
}

module.exports = { executeSystemEvents }
