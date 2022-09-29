'use strict';
var {
    ExactObject,
    ForeignId,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({} = {}) => (
    Message({
        type: `experiment/remove-subject-manual`,
        payload: ExactObject({
            properties: {
                experimentId: ForeignId({
                    collection: 'experiment',
                }),
                subjectId: ForeignId({
                    collection: 'subject',
                }),
            },
            required: [
                'experimentId',
                'subjectId',
            ]
        })
    })
)

module.exports = createSchema;
