'use strict';
var {
    ExactObject,
    Id,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
    CustomTypeLabelDefinition,
} = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    return Message({
        type: `custom-record-types/set-record-label-definition`,
        payload: ExactObject({
            properties: {
                id: Id(),
                props: CustomTypeLabelDefinition(),
            },
            required: [
                'id',
                'props',
            ]
        })
    });
}

module.exports = Schema;
