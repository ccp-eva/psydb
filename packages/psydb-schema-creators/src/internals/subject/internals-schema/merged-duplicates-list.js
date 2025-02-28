'use strict';
var {
    DefaultArray,
    ClosedObject,
    ForeignId,
    SequenceNumber,
    OnlineId
} = require('@mpieva/psydb-schema-fields');

var MergedDuplicatesList = () => {
    var schema = DefaultArray({
        items: ClosedObject({
            '_id': ForeignId({ collection: 'subject' }),
            'sequenceNumber': SequenceNumber(),
            'onlineId': OnlineId(),
        })
    });

    return schema;
}

module.exports = MergedDuplicatesList;
