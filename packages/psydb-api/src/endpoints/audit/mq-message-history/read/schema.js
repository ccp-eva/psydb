'use strict';
var {
    ClosedObject,
    Id,
} = require('@mpieva/psydb-schema-fields');

var Schema = (bag = {}) => {
    return ClosedObject({
        correlationId: { type: 'string' }, // XXX nanoid
    })
}

module.exports = Schema;
