'use strict';

var MongoMQ = ({
    collection,
    createId,
}) => {
    var mq = {};

    mq.add = async (message) => {
        var _id = createId();
        if (_id instanceof Promise) {
            _id = await _id;
        }

        var doc = {
            _id,
            timestamp: new Date(),
            message,
        };

        await collection.insertOne(doc);

        return doc;
    };

    mq.remove = async (_id) => {
        await collection.deleteOne({ _id });
    }

    return mq;
}

module.exports = MongoMQ;
