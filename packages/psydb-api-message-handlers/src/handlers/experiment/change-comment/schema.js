'use strict';

var {
    ExactObject,
    ForeignId,
    FullText,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({} = {}) => (
    Message({
        type: `experiment/change-comment`,
        payload: ExactObject({
            properties: {
                experimentId: ForeignId({
                    collection: 'experiment',
                }),
                comment: FullText(),
            },
            required: [
                'experimentId',
                'comment',
            ]
        })
    })
)

module.exports = createSchema;
