'use strict';
var {
    ExactObject,
    Id,
    EventId,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    return Message({
        type: `subject/remove`,
        payload: ExactObject({
            properties: {
                id: Id(),
                lastKnownGdprEventId: EventId(),
                lastKnownScientificEventId: EventId(),
            },
            required: [
                'id',
                'lastKnownGdprEventId',
                'lastKnownScientificEventId',
            ]
        })
    });
}

module.exports = Schema;
