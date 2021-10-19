'use strict';
var {
    DefaultArray,
    ExactObject,
    JsonPointer,
    StringEnum
} = require('@mpieva/psydb-schema-fields');

var SubjectFieldRequirementList = () => {
    return DefaultArray({
        title: 'Bedingungen',
        systemType: 'SubjectFieldRequirementList',
        // this has to be checked later on
        // in the message handler
        items: ExactObject({
            systemType: 'SubjectFieldRequirement',
            properties: {
                pointer: JsonPointer(),
                check: StringEnum([ 'inter-subject-equality' ]),
            },
            required: [
                'pointer',
                'check'
            ]
        })
    })
}

module.exports = {
    SubjectFieldRequirementList
}
