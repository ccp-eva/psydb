'use strict';
var {
    createInitialChannelState,
    pathifyProps,
} = require('@mpieva/psydb-api-lib');

var {
    destructureMessage,
    openChannel,
    createRecordPropMessages,
    dispatchRecordPropMessages,
} = require('../generic-record-handler-utils');

var triggerSystemEvents = async ({
    db,
    rohrpost,
    personnelId,
    message,
    cache,

    dispatchProps,
}) => {
    var destructured = destructureMessage({ message });
    var { collection, recordType, props } = destructured;

    var channel = await openChannel({
        db,
        rohrpost,
        ...destructured
    });

    if (props.gdpr || props.scientific) {
        if (props.gdpr) {
            await dispatchProps({
                collection,
                recordType,
                channel,
                subChannelKey: 'gdpr',
                props: props.gdpr,
                initialize: channel.isNew,
            })
        }
        if (props.scientific) {
            await dispatchProps({
                collection,
                channel,
                recordType,
                subChannelKey: 'scientific',
                props: props.scientific,
                initialize: channel.isNew,
            })
        }
    }
    else {
        await dispatchProps({
            collection,
            channel,
            recordType,
            props,
            initialize: channel.isNew,
        })
    }

    cache.currentChannelId = channel.id;
}

module.exports = triggerSystemEvents;
