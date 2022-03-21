'use strict';
var {
    ExactObject,
    ForeignId,
    DateTimeInterval,
    StringEnum,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({} = {}) => (
    Message({
        type: `experiment/create-followup-awayteam`,
        payload: ExactObject({
            properties: {
                sourceExperimentId: ForeignId({ collection: 'experiment' }),
                targetInterval: DateTimeInterval(),
                subjectOp: StringEnum([
                    'copy',
                    'move-unprocessed',
                    'none'
                ]),
            },
            required: [
                'sourceExperimentId',
                'targetInterval',
                'subjectOp',
            ]
        })
    })
)

module.exports = createSchema;
