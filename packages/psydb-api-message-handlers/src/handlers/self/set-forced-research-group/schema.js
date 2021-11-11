'use strict';
var {
    ExactObject,
    ForeignId,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({ messageType } = {}) => {
    return Message({
        type: messageType,
        payload: ExactObject({
            properties: {
                researchGroupId: ForeignId({
                    collection: 'researchGroup',
                    isNullable: true,
                }),
            },
            required: [
                'researchGroupId'
            ]
        })
    });
}

module.exports = createSchema;
