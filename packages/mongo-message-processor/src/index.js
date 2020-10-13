'use strict';
var MongoMQ = require('@mpieva/mongo-mq'),
    Rohrpost = require('@mpieva/switchboard');

var MongoRohrpost = ({
    db,
    key,

    createChannelId,
    createMessageId,

    onDispatch,
}) => {
    var wrapper = {};

    var rohrpost = Rohrpost({
        key,
        createChannelId,
        createMessageId,

        onDispatch: (...args) => (
            wrap({
                ...args,
                db,
            })(onDispatch)
        )
    });

    return broker;
}

module.exports = MessageProcessor;
