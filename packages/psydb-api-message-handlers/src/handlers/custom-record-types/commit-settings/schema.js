'use strict';
var {
    ExactObject,
    Id,
    EventId,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
} = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    return Message({
        type: `custom-record-types/commit-settings`,
        payload: ExactObject({
            properties: {
                id: Id(),
                lastKnownEventId: EventId(), // FIXME: remove
            },
            required: [
                'id',
            ]
        })
    });
}

module.exports = Schema;
