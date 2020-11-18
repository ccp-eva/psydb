'use strict';
var Address = require('../../compound-fields/address').ref;

var id = 'psy-db/institute/baserecord',
    ref = { $ref: `${id}#` };

var schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: id,
    type: 'object',
    properties: {
        name: { type: 'string' },
        address: Address
    },
}

module.exports = {
    id,
    ref,
    schema,
}
