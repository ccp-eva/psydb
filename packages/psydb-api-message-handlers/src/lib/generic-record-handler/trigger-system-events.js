'use strict';

var pathifyProps = ({
    subChannelKey,
    props,
    prefix,
    depth = 0
}) => {
    var mongoSet = Object.keys(props).reduce((acc, key) => {
        var value = props[key];
        var path = (
            prefix
            ? `${prefix}.${key}`
            : subChannelKey 
            ? `${subChannelKey}.state.${key}`
            : `state.${key}`
        );

        var converted = (
            key === 'custom' && depth === 0
            ? pathifyProps({
                props: value,
                prefix: path,
                depth: depth + 1
            })
            : { [path]: value }
        );

        return {
            ...acc,
            ...converted
        };
    }, {});

    return mongoSet;
}


var {
    destructureMessage,
    openChannel,
    createRecordPropMessages,
    dispatchRecordPropMessages
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

    var { props } = destructured;
    if (props.gdpr || props.scientific) {
        if (props.gdpr) {
            await dispatch({
                ...destructured,
                channel,
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
                payload: { $set: pathifyProps({
                    subChannelKey: 'gdpr',
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
