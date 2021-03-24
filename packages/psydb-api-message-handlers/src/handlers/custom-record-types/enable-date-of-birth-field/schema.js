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
        type: `custom-record-types/enable-date-of-birth-field`,
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
