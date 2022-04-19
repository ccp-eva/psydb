'use strict';
var {
    ExactObject,
    Id,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    return Message({
        type: `subject/remove-participation`,
        payload: ExactObject({
            properties: {
                participationId: Id(),
            },
            required: [
                'participationId',
            ]
        })
    });
}

module.exports = Schema;
