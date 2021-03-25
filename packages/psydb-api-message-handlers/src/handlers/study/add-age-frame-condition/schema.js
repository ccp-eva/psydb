'use strict';
var {
    ExactObject,
    Id,
    EventId,
    ForeignId,
    IdentifierString,
    DaysSinceBirthInterval,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
} = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    return Message({
        type: `study/add-age-frame-condition`,
        payload: ExactObject({
            properties: {
                id: Id(),
                lastKnownEventId: EventId(),
                customRecordTypeId: ForeignId({
                    collection: 'customRecordType',
                    constraints: {
                        '/collection': 'subject'
                    }
                }),
                ageFrame: DaysSinceBirthInterval(),
                props: ExactObject({
                    properties: {
                        field: IdentifierString(),
                        values: {
                            type: 'array',
                            default: [],
                            // TODO: items format depends on field
                            // referenced in customRecordType 
                        },
                        canChangePerSearch: {
                            type: 'boolean',
                            default: false
                        },
                    },
                    required: [
                        'field',
                        'values',
                        'canChangePerSearch',
                    ]
                }),
            },
            required: [
                'id',
                'lastKnownEventId',
                'customRecordTypeId',
                'ageFrame',
                'props'
            ]
        })
    });
}

module.exports = Schema;
