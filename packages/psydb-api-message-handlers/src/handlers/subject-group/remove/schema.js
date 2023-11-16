'use strict';
var {
    ExactObject,
    Id,
    EventId,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    return Message({
        type: `subjectGroup/remove`,
        payload: ExactObject({
            properties: {
                id: Id(),
                lastKnownEventId: EventId(),
            },
            required: [
                'id',
            ]
        })
    });
}

module.exports = Schema;
