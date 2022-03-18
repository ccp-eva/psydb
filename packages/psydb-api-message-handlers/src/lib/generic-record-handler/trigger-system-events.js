'use strict';
var { createInitialChannelState } = require('@mpieva/psydb-api-lib');

var {
    destructureMessage,
    openChannel,
    createRecordPropMessages,
    dispatchRecordPropMessages,
    pathifyProps,
} = require('../generic-record-handler-utils');

var triggerSystemEvents = async ({
    db,
    rohrpost,
    personnelId,
    message,

    dispatch,
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
            var defaults = await createInitialChannelState({
                db,
                collection,
                subChannelKey: 'gdpr',
            });
            await dispatch({
                ...destructured,
                channel,
                subChannelKey: 'gdpr',
                payload: { $set: pathifyProps({
                    subChannelKey: 'gdpr',
                    props
                }) }
            })
        }
        if (props.scientific) {
            await dispatch({
                ...destructured,
                channel,
                subChannelKey: 'scientific',
                payload: { $set: pathifyProps({
                    subChannelKey: 'scientific',
                    props
                }) }
            })
        }
    }
    else {
        await dispatch({
            ...destructured,
            channel,
            payload: { $set: pathifyProps({
                props
            }) }
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
