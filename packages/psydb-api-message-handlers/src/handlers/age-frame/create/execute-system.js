'use strict';
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');
var { keyBy } = require('@mpieva/psydb-core-utils');
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

    var { subjectCRT } = cache.get();

    // FIXME: schema needs to handle this actually
    var defsByPointer = keyBy({
        items: subjectCRT.allCustomFields(),
        byProp: 'pointer'
    });
    for (var it of props.conditions) {
        var { pointer, values } = it;
        var def = defsByPointer[pointer];
        if ([
            'HelperSetItemId',
            'HelperSetItemIdList',
            'ForeignId',
            'ForeignIdList'
        ].includes(def.systemType)) {
            it.values = it.values.map(ObjectId)
        }
    }

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
