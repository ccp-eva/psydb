'use strict';
var id = 'psy-db/primitives/mongo-oid.schema.js',
    ref = { $ref: `${id}#` };

var schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: id,
    type: 'object',
    properties: {
        $oid: {
            type: 'string',
            examples: [
                '58121ec716ceca1b4fd1b538',
                '580e02c717344a2f393c11cb',
                '581e2a165553561f35298b8f'
            ]
        }
    },
    required: [
        '$oid'
    ]
}

module.exports = {
    id,
    ref,
    schema
};
