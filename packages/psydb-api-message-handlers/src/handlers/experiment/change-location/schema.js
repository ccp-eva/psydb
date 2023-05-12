'use strict';
var {
    ExactObject,
    ForeignId,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({} = {}) => (
    Message({
        type: `experiment/change-location`,
        payload: ExactObject({
            properties: {
                experimentId: ForeignId({ collection: 'experiment' }),
                locationId: ForeignId({ collection: 'location' }),
            },
            required: [
                'experimentId',
                'locationId',
            ]
        })
    })
)

module.exports = createSchema;
