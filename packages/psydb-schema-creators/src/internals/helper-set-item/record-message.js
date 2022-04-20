'use strict';
// FIXME: unised; see messge handler
var {
    Message
} = require('@mpieva/psydb-schema-helpers');

var {
    ExactObject,
    Id,
    ForeignId,
    EventId,
} = require('@mpieva/psydb-schema-fields');

var HelperSetItemState = require('./state');

var HelperSetItemRecordMessage = ({ op }) => {
    var payload = undefined;
    if (op === 'create') {
        payload = ExactObject({
            properties: {
                setId: ForeignId({ collection: 'helperSet'}),
                props: HelperSetItemState(),
            },
            required: [
                'setId',
                'props',
            ]
        });
    }
    else if (op === 'patch') {
        payload = ExactObject({
            properties: {
                id: Id(),
                //lastKnownEventId: EventId(),
                props: HelperSetItemState(),
            },
            required: [
                'id',
                //'lastKnownEventId',
                'props',
            ]
        });
    }
    else {
        throw new Error('unknown op');
    }

    var schema = Message({
        type: `helperSetItem/${op}`,
        payload
    });

    console.log(schema);

    return schema;
}

module.exports = HelperSetItemRecordMessage;
