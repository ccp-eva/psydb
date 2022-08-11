'use strict';
var {
    ExactObject,
    Id,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var Schema = ({ messageType }) => {
    return Message({
        type: messageType ,
        payload: ExactObject({
            properties: {
                id: Id(),
            },
            required: [
                'id',
            ]
        })
    });
}

module.exports = Schema;
