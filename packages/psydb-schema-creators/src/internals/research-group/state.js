'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ExactObject,
    SaneString,
    Address,
    FullText
} = require('@mpieva/psydb-schema-fields');

var ResearchGroupState = ({} = {}) => {
    var schema = ExactObject({
        properties: {
            name: SaneString(),
            shorthand: SaneString({ minLength: 2 }),
            address: Address({
                required: []
            }),
            description: FullText(),
            // TODO: permissions????
            // should they be readable to all?
            // and writable only to root accounts?
            // or normal read/write by researchgroup?
            //
        },
        required: [
            'name',
            'shorthand',
            'address',
            'description'
        ]
    })

    return schema;
}

module.exports = ResearchGroupState;
