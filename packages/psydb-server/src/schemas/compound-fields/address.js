'use strict';
var id = 'psy-db/address-field',
    ref = `${id}#`;

var schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: id,
    type: 'object',
    properties: {
        country: { type: 'string' },
        city: { type: 'string' },
        postcode: { type: 'string' },
        street: { type: 'string' },
        housenumber: { type: 'string' },
        affix: { type: 'string' },
    }
}

module.exports = {
    id,
    ref,
    schema,
}
