'use strict';

var {
    ExactObject,
    Id,
    EventId,
    ForeignId,
    FullText,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({} = {}) => (
    Message({
        type: `experiment/change-per-subject-comment`,
        payload: ExactObject({
            properties: {
                experimentId: ForeignId({
                    collection: 'experiment',
                }),
                subjectId: ForeignId({
                    collection: 'subject',
                }),
                comment: FullText(),
            },
            required: [
                'experimentId',
                'subjectId',
                'comment',
            ]
        })
    })
)

module.exports = createSchema;
