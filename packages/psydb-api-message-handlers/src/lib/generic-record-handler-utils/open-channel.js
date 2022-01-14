'use strict';

var openChannel = (options) => {
    var {
        rohrpost,
        op,
        collection,
        recordType,
        additionalCreateProps,
        id
    } = options;
    
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
                    ...additionalCreateProps
                }
                : undefined
            )
        })
    );

    return channel;
}

module.exports = { openChannel }
