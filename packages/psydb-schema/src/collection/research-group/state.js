'use strict';
var inline = require('@cdxoo/inline-text'),
    prefix = require('./schema-id-prefix');

var {
    ExactObject,
    SaneString,
    Address,
    FullText
} = require('@mpieva/psydb-schema-fields');

var ResearchGroupState = ({} = {}) => {
    var schema = ExactObject({
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/state`,
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
    })

    return schema;
}

module.exports = ResearchGroupState;
