'use strict';
var isThennable = require('./is-thennable');

var defaultRedactMessageOnPersist = (ephemeralMessage) => {
    var { payload, ...persistentMessage } = ephemeralMessage;
    return persistentMessage;
}

var MongoMQ = ({
    db,
    ephemeralCollectionName,
    persistCollectionName,
    createId,

    redactMessageOnPersist,
}) => {
    //createId = createId || () => ( new ObjectId() );
    redactMessageOnPersist = (
        redactMessageOnPersist || defaultRedactMessageOnPersist
    );

    var mq = {};

    mq.add = async (message) => {
        var _id = createId();
        if (isThennable(_id)) {
            _id = await _id;
        }

        var correlationMessage = {
            _id,
            timestamp: new Date(),
            message,
        };

        await (
            db
            .collection(ephemeralCollectionName)
            .insertOne(correlationMessage)
        );

        return correlationMessage;
    };

    mq.remove = async (_id) => {
        await (
            db
            .collection(ephemeralCollectionName)
            .deleteOne({ _id })
        );
    }

    mq.persist = async (_id) => {
        var correlationMessage = await (
            db
            .collection(ephemeralCollectionName)
            .findOne({ _id })
        );

        var persistentCorrelationMessage = {
            ...correlationMessage,
            message: redactMessageOnPersist(correlationMessage.message),
        }

        await (
            db
            .collection(persistCollectionName)
            .insertOne(persistentCorrelationMessage)
        )

        return persistentCorrelationMessage;
    }

    return mq;
}

module.exports = MongoMQ;
