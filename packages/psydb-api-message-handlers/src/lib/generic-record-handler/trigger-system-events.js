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

    var { collection, props } = destructured;

    if (props.gdpr || props.scientific) {
        if (props.gdpr) {
            await dispatchProps({
                collection,
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
            props,
            initialize: channel.isNew,
        })
    }

    /*var recordPropMessages = createRecordPropMessages({
        personnelId,
        props: destructured.props
    });

    await dispatchRecordPropMessages({
        channel,
        ...destructured,
        recordPropMessages
    });*/
}

module.exports = triggerSystemEvents;
