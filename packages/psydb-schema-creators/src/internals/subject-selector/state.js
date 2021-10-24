'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ExactObject,
    DefaultBool,
    DefaultArray,
    CustomRecordTypeKey,
} = require('@mpieva/psydb-schema-fields');

var SubjectSelectorState = ({} = {}) => {
    var schema = ExactObject({
        properties: {
            isEnabled: DefaultBool({
                const: true,
                default: true
            }),
            generalConditions: DefaultArray({
                items: ExactObject({ properties: {} })
            })
        },
        required: [
            'isEnabled',
        ]
    })

    return schema;
}

module.exports = SubjectSelectorState;

