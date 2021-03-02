'use strict';
var inline = require('@cdxoo/inline-text'),
    prefix = require('./schema-id-prefix');

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
        },
    })

    return schema;
}
