'use strict';
var {
    ExactObject,
    Id,
    EventId,
    IdentifierString,
    SaneString,
    StringEnum
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
} = require('@mpieva/psydb-schema-helpers');

var Schema = ({ collection, isPrecheck } = {}) => {
    return Message({
        type: `custom-record-types/set-general-data`,
        payload: ExactObject({
            properties: {
                id: Id(),
                lastKnownEventId: EventId(),
                label: SaneString({ minLength: 1 }),
                ...((collection === 'location' || isPrecheck) && {
                    reservationType: StringEnum([
                        'away-team',
                        'inhouse',
                        'no-reservation'
                    ])
                })
            },
            required: [
                'id',
                //'lastKnownEventId',
                'label',
                ...(
                    collection === 'location' && !isPrecheck
                    ? ['reservationType']
                    : []
                )
            ]
        })
    });
}

module.exports = Schema;
