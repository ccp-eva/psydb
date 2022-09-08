'use strict';
var {
    ExactObject,
    ForeignId,
    StringEnum,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({} = {}) => (
    Message({
        type: `experiment/auto-process-subjects`,
        payload: ExactObject({
            properties: {
                experimentId: ForeignId({
                    collection: 'experiment',
                }),
                participationStatus: StringEnum([
                    'participated',
                    'didnt-participate'
                ]),
            },
            required: [
                'experimentId',
                'participationStatus'
            ]
        })
    })
)

module.exports = createSchema;
