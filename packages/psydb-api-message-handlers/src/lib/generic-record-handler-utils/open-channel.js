'use strict';
var { findAndUpdateSequenceNumber } = require('@mpieva/psydb-api-lib');

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
   
    var sequenceNumber = await findAndUpdateSequenceNumber({
        db, collection, recordType,
        desiredSequenceNumber: sequenceNumber
    });

    await db.collection(collection).ensureIndex({
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
