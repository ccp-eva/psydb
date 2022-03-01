'use strict';
var {
    ExactObject,
    Id,
    EventId,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    return Message({
        type: `personnel/remove`,
        payload: ExactObject({
            properties: {
                id: Id(),
                lastKnownScientificEventId: EventId(),
            },
            required: [
                'id',
                'lastKnownScientificEventId',
            ]
        })
    });
}

module.exports = Schema;
