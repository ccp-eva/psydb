'use strict';
var {
    ExactObject,
    Id,
    EventId,
    ForeignId,
    IdentifierString,
    DaysSinceBirthInterval,
    DefaultArray,
} = require('@mpieva/psydb-schema-fields');

var {
    AgeFrameSettingsListItem,
} = require('@mpieva/psydb-schema-fields-special');

var {
    Message,
} = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    return Message({
        type: `study/add-age-frame`,
        payload: ExactObject({
            properties: {
                id: Id(),
                lastKnownEventId: EventId(),
                customRecordType: IdentifierString(),
                props: ExactObject({
                    properties: {
                        ageFrame: DaysSinceBirthInterval(),
                        conditions: DefaultArray({ items: (
                            // TODO: this is incomplete; us emulti step
                            // validation with AgeFrameSettingsListItem
                            ExactObject({
                                properties: {
                                    fieldKey: IdentifierString(),
                                    values: {
                                        type: 'array',
                                        default: [],
                                        // TODO: items format depends on field
                                        // referenced in customRecordType 
                                    },
                                },
                                required: [
                                    'fieldKey',
                                    'values',
                                ]
                            })
                        )})
                    },
                    required: [
                        'ageFrame',
                        'conditions'
                    ]
                })
            },
            required: [
                'id',
                'lastKnownEventId',
                'customRecordType',
                'props',
            ]
        })
    });
}

module.exports = Schema;
