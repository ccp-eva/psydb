'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ExactObject,
    ForeignId,
    DateTimeInterval,
} = require('@mpieva/psydb-schema-fields');

var InhouseReservationState = ({
    enableInternalProps
} = {}) => {
    var schema = ExactObject({
        properties: {
            ...(enableInternalProps && {
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

