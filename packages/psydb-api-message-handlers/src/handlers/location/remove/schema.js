'use strict';
var {
    ExactObject,
    Id,
    EventId,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    return Message({
        type: `location/remove`,
        payload: ExactObject({
            properties: {
                id: Id(),
                lastKnownEventId: { type: 'string' } //TODO: remove
            },
            required: [
                'id',
            ]
        })
    });
}

module.exports = Schema;
