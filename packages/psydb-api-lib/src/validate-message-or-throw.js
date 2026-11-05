'use strict';
var { Message } = require('@mpieva/psydb-schema-helpers');
var validateOrThrow = require('./validate-or-throw');

var validateMessageOrThrow = (bag) => {
    var { handler, message, schema, wrapAsMessage = true, ...pass } = bag;

    schema = (
        handler && wrapAsMessage
        ? Message({ type: handler.type, payload: schema })
        : schema
    );

    var out = validateOrThrow({
        apiStatus: 'InvalidMessageSchema',
        payload: message, schema, ...pass,
    });

    return wrapAsMessage ? out.payload : out;
}

module.exports = validateMessageOrThrow;
