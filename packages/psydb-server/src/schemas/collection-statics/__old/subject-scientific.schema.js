'use strict';
var MongoDate = require('../primitives/mongo-date.schema.js').ref,
    Dynamic = require('../dynamic-refs.js');

var id = 'psy-db/subject-scientific.schema.js',
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
                        subtype: { enum: [ 'child' ] }
                    }
                },
                {
                    type: 'object',
                    properties: {
                        type: { const: 'animal' },
                        subtype: { enum: [ 'chimpanzee', 'bonobo' ] }
                    }
                },
            ]
        },
        Dynamic.SubjectScientific,
    ]
}

module.exports = {
    id,
    ref,
    schema,
}
