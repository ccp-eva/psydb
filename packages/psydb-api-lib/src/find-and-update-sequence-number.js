'use strict';
var prepend = (prefix, seq) => (
    `${prefix}${seq}`
);
var strip = (prefix, desired) => (
    parseInt(String(desired).replace(prefix, ''))
);

var findAndUpdateSequenceNumber = async (bag) => {
    var {
        db,
        collection,
        recordType = null,
        desiredSequenceNumber = undefined
    } = bag;

    var nextSequenceNumber = undefined;

    var { prefix = '' } = await (
        db.collection('sequenceNumberPrefix').findOne({
            _id: { collection, recordType }
        })
    ) || {};

    var seqpath = (
        recordType
        ? `${collection}.${recordType}`
        : collection
    );
    if (desiredSequenceNumber) {
        var stripped = strip(prefix, desiredSequenceNumber)

        var { value: seqdoc } = await (
            db.collection('sequenceNumbers').findOneAndUpdate(
                { _id: 1, $or: [
                    { [seqpath]: { $exists: false }},
                    { [seqpath]: { $lt: stripped }},
                ]},
                { $set: { [seqpath]: stripped }},
                { returnDocument: 'after' }
            )
        );

        nextSequenceNumber = stripped;
    }
    else {
        var { value: seqdoc } = await (
            db.collection('sequenceNumbers').findOneAndUpdate(
                { _id: 1 },
                { $inc: { [seqpath]: 1 }},
                { returnDocument: 'after' }
            )
        );

        nextSequenceNumber = (
            recordType
            ? seqdoc[collection][recordType]
            : seqdoc[collection]
        );
    }


    return prepend(prefix, nextSequenceNumber);
}

module.exports = findAndUpdateSequenceNumber;
