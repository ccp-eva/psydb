'use strict';
var {
    ExactObject,
    ForeignId,
    DateTimeInterval,
    StringEnum,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({ messageType } = {}) => (
    Message({
        type: messageType,
        payload: ExactObject({
            properties: {
                experimentId: ForeignId({ collection: 'experiment' }),
            },
            required: [
                'experimentId',
            ]
        })
    })
)

module.exports = createSchema;
