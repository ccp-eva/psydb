'use strict';

var {
    ExactObject,
    Id,
    EventId,
    ForeignId,
    FullText,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({} = {}) => (
    Message({
        type: `experiment/add-subject`,
        payload: ExactObject({
            properties: {
                experimentId: ForeignId({
                    collection: 'experiment',
                }),
                subjectId: ForeignId({
                    collection: 'subject',
                }),
                comment: FullText(),
                autoConfirm: DefaultBool(),
            },
            required: [
                'experimentId',
                'subjectId',
            ]
        })
    })
)

module.exports = createSchema;
