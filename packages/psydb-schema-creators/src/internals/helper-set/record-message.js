'use strict';
var {
    Message
} = require('@mpieva/psydb-schema-helpers');

var {
    ExactObject,
    OpenObject,
    Id,
    ForeignId,
    EventId,
} = require('@mpieva/psydb-schema-fields');

var HelperSetState = require('./state');

var HelperSetRecordMessage = ({ op }) => {
    var payload = undefined;
    if (op === 'create') {
        payload = ExactObject({
            properties: {
                id: Id(),
                props: HelperSetState(),
            },
            required: [
                'props',
            ]
        });
    }
    else if (op === 'patch') {
        payload = OpenObject({
            properties: {
                id: Id(),
                //lastKnownEventId: EventId(),
                props: HelperSetState(),
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

    return Message({
        type: `helperSet/${op}`,
        payload
    })
}

module.exports = HelperSetRecordMessage;
