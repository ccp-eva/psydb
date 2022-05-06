'use strict';

var openChannel = async (options) => {
    var {
        db,
        rohrpost,
        op,
        collection,
        recordType,
        additionalCreateProps,

        id,
        sequenceNumber,
    } = options;
   
    var seqpath = (
        recordType
        ? `${collection}.${recordType}`
        : collection
    );
    if (sequenceNumber) {
        var { value: seqdoc } = await (
            db.collection('sequenceNumbers').findOneAndUpdate(
                { _id: 1, $or: [
                    { [seqpath]: { $exists: false }},
                    { [seqpath]: { $lt: sequenceNumber }},
                ]},
                { $set: { [seqpath]: sequenceNumber }},
                { returnOriginal: false }
            )
        );
    }
    else {
        var { value: seqdoc } = await (
            db.collection('sequenceNumbers').findOneAndUpdate(
                { _id: 1 },
                { $inc: { [seqpath]: 1 }},
                { returnOriginal: false }
            )
        );
        sequenceNumber = (
            recordType
            ? seqdoc[collection][recordType]
            : seqdoc[collection]
        );
    }

    await db.collection(collection).createIndex({
        ...( recordType && { type: 1 }),
        sequenceNumber: 1
    }, { unique: true })

    // FIXME: dispatch silently ignores messages when id is set
    // but record doesnt exist
    var channel = (
        rohrpost
        .openCollection(collection)
        .openChannel({
            id,
            isNew: op === 'create',
            additionalChannelProps: (
                op === 'create'
                ? {
                    ...(recordType && { type: recordType }),
                    sequenceNumber,
                    isDummy: false,
                    ...additionalCreateProps
                }
                : undefined
            )
        })
    );

    return channel;
}

module.exports = { openChannel }
