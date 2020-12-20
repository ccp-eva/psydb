'use strict';
var {
    IdentifierString,
    SaneString
} = require('@mpieva/psydb-schema-fields');

var Message = require('../message');

var CreateHelperSetMessage = Message({
    type: 'create-helper-set',
    payload: {
        key: IdentifierString(),
        label: SaneString(),
    }
});

module.exports = CreateHelperSetMessage;
