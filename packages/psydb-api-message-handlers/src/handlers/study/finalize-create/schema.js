'use strict';
var {
    ExactObject,
    Id,
    EventId,
    ForeignId,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
} = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    return Message({
        type: `study/finalize-create`,
        payload: ExactObject({
            properties: {
                id: Id(),
                lastKnownEventId: EventId(),
            },
            required: [
                'id',
                'lastKnownEventId',
            ]
        })
    });
}

module.exports = Schema;
