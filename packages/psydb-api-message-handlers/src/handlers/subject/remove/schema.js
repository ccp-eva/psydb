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
                lastKnownSubChannelEventIds: ExactObject({
                    properties: {
                        gdpr: EventId(),
                        scientific: EventId(),
                    },
                    required: [
                        'gdpr',
                        'scientific'
                    ]
                }),
            },
            required: [
                'id',
                'lastKnownSubChannelEventIds',
            ]
        })
    });
}

module.exports = Schema;
