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
        type: `experiment/followup-awayteam-move-to-placeholder`,
        payload: ExactObject({
            properties: {
                sourceExperimentId: ForeignId({ collection: 'experiment' }),
                targetExperimentId: ForeignId({ collection: 'experiment' }),
            },
            required: [
                'sourceExperimentId',
                'targetExperimentId',
            ]
        })
    })
)

module.exports = createSchema;
