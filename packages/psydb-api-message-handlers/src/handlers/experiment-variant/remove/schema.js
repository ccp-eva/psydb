'use strict';
var { ExactObject, Id } = require('@mpieva/psydb-schema-fields');
var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({} = {}) => {
    return Message({
        type: `experiment-variant/remove`,
        payload: ExactObject({
            properties: {
                id: Id(),
            },
            required: [ 'id' ]
        })
    });
}

module.exports = createSchema;
