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

    dispatchProps,
}) => {
    var destructured = destructureMessage({ message });

    var channel = await openChannel({
        db,
        rohrpost,
        ...destructured
    });

    var { collection, recordType, props } = destructured;

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
}

module.exports = triggerSystemEvents;
