'use strict';

var LockingChannelEvent = (props) => ({
    ...NonLockingChannelEvent(props),
    processed: false,
});

var NonLockingChannelEvent = ({
    id,
    timestamp,
    correlationId,
    message
}) => ({
    _id: id,
    timestamp,
    correlationId,
    message
});

module.exports = {
    LockingChannelEvent,
    NonLockingChannelEvent
}
