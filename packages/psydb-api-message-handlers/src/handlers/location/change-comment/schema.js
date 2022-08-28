'use strict';

var {
    ExactObject,
    ForeignId,
    FullText,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({} = {}) => (
    Message({
        type: `location/change-comment`,
        payload: ExactObject({
            properties: {
                locationId: ForeignId({
                    collection: 'location',
                }),
                comment: FullText(),
            },
            required: [
                'locationId',
                'comment',
            ]
        })
    })
)

module.exports = createSchema;
