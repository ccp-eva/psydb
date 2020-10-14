'use strict';

var LockingEvent = (props) => ({
    ...NonLockingEvent(props),
    processed: false,
});

var NonLockingEvent = ({
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
    LockingEvent,
    NonLockingEvent
}
