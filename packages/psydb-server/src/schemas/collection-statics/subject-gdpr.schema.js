'use strict';
var MongoDate = require('../primitives/mongo-date.schema.js').ref,
    Dynamic = require('../dynamic-refs.js');

var id = 'psy-db/subject-gdpr.schema.js',
    ref = { $ref: `${id}#` };

var schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: id,
    allOf: [
        {
            oneOf: [
                {
                    type: 'object',
                    properties: {
                        type: { const: 'human' },
                        subtype: { type: 'string' },
                        firstname: { type: 'string' },
                        lastname: { type: 'string' }
                    }
                },
                {
                    type: 'object',
                    properties: {
                        type: { const: 'animal' },
                        subtype: { type: 'string' },
                        name: { type: 'string' }
                    }
                },
            ]
        },
        Dynamic.SubjectGDPR,
    ]
}

module.exports = {
    id,
    ref,
    schema,
}
