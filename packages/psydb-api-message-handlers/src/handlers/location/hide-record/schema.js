'use strict';
var {
    ExactObject,
    Id,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var Schema = ({ messageType }) => {
    return Message({
        type: messageType ,
        payload: ExactObject({
            properties: {
                id: Id(),
                detachSubjects: DefaultBool()
            },
            required: [
                'id',
                'detachSubjects'
            ]
        })
    });
}

module.exports = Schema;
