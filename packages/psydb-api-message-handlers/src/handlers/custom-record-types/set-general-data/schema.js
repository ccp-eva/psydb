'use strict';
var {
    ExactObject,
    OpenObject,
    Id,
    EventId,
    IdentifierString,
    SaneString,
    StringEnum,
    DefaultBool
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
                displayNameI18N: OpenObject({
                    de: SaneString()
                }),
                ...((collection === 'subject' || isPrecheck) && {
                    requiresTestingPermissions: DefaultBool(),
                    commentFieldIsSensitive: DefaultBool(),
                    showSequenceNumber: DefaultBool(),
                    showOnlineId: DefaultBool(),
                }),
                ...((collection === 'location' || isPrecheck) && {
                    reservationType: StringEnum([
                        'away-team',
                        'inhouse',
                        'no-reservation'
                    ])
                }),
                ...((collection === 'study' || isPrecheck) && {
                    enableSubjectSelectionSettings: DefaultBool(),
                    enableLabTeams: DefaultBool(),
                }),
            },
            required: [
                'id',
                //'lastKnownEventId',
                'label',
                'displayNameI18N',
                ...(
                    collection === 'subject' && !isPrecheck
                    ? [
                        'requiresTestingPermissions',
                        'commentFieldIsSensitive'
                    ]
                    : []
                ),
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
