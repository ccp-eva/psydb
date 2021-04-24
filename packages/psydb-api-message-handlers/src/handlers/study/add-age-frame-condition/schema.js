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
                customRecordType: IdentifierString(),
                ageFrame: DaysSinceBirthInterval(),
                props: ExactObject({
                    properties: {
                        fieldKey: IdentifierString(),
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
                        'fieldKey',
                        'values',
                        'canChangePerSearch',
                    ]
                }),
            },
            required: [
                'id',
                'lastKnownEventId',
                'customRecordType',
                'ageFrame',
                'props'
            ]
        })
    });
}

module.exports = Schema;
