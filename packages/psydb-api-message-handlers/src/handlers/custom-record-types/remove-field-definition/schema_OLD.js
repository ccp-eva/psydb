'use strict';
var {
    ExactObject,
    Id,
    EventId,
    IdentifierString,
    SubChannelKey,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    var required = {
        'id': Id(),
        'key': IdentifierString(),
    }
    // FIXME: this is actually either required or should not be send
    // at all depending on collection
    var optional = {
        'subChannelKey': SubChannelKey(), 
    }

    return Message({
        'type': 'custom-record-types/remove-field-definition',
        'payload': ExactObject({
            properties: { ...required, ...optional },
            required: Object.keys(required)
        })
    });
}

module.exports = Schema;
