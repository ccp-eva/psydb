'use strict';
var {
    ExactObject,
    Id,
    EventId,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
    CustomTypeLabelDefinition,
} = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    return Message({
        type: `custom-record-types/set-record-label-definition`,
        payload: ExactObject({
            properties: {
                id: Id(),
                lastKnownEventId: EventId(),
                props: CustomTypeLabelDefinition(),
            },
            required: [
                'id',
                'lastKnownEventId',
                'props',
            ]
        })
    });
}

module.exports = Schema;
