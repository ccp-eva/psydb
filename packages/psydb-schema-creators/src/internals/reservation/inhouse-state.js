'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ExactObject,
    ForeignId,
    DateTimeInterval,
    Id,
} = require('@mpieva/psydb-schema-fields');

// TODO: merge adjascent reservations into one? or have a handler?
var InhouseReservationState = ({
    enableInternalProps
} = {}) => {
    var schema = ExactObject({
        properties: {
            seriesId: Id({
                description: inline`
                    used when this reservation belongs to a series
                    of reservations
                `,
            }), // foreign id w/ custom handler??
            isDeleted: {
                type: 'boolean',
                default: false
            },

            studyId: ForeignId({
                collection: 'study',
            }),
            experimentOperatorTeamId: ForeignId({
                collection: 'experimentOperatorTeam',
            }),
            locationId: ForeignId({
                collection: 'location',
            }),
            interval: DateTimeInterval(),
        }
    })

    return schema;
}

module.exports = InhouseReservationState;

