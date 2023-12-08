'use strict';
var {
    ClosedObject,
    Id,
} = require('@mpieva/psydb-schema-fields');

var Schema = (bag = {}) => {
    return ClosedObject({
        updateId: Id()
    })
}

module.exports = Schema;
