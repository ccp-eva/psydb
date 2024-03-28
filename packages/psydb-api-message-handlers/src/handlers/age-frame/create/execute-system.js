'use strict';
var { compose, switchComposition } = require('@mpieva/psydb-api-lib');
var { openChannel } = require('../../../lib/generic-record-handler-utils');

var compose_executeSystemEvents = () => compose([
    createRecord,
]);

var createRecord = async (context, next) => {
    var { db, now, message, cache, rohrpost, dispatchProps } = context;
    var { payload, timezone } = message; // FIXME: timezone from header
    var {
        id, sequenceNumber, // NOTE: was used when migrating ignored now
        studyId, subjectSelectorId, subjectTypeKey, props
    } = payload;

    var collection = 'ageFrame';
    var channel = await openChannel({
        db, rohrpost, collection, op: 'create',
        timezone,
        additionalCreateProps: { studyId, subjectSelectorId, subjectTypeKey }
    });
    
    await dispatchProps({
        collection, channel, props, initialize: true,
    });

    cache.merge({ channelId: channel.id });
    await next();
}

module.exports = {
    executeSystemEvents: compose_executeSystemEvents()
}
