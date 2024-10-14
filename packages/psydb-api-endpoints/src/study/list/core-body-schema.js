'use strict';
var {
    OpenObject, MaxObject, IdentifierString, DefaultBool, StringEnum,
} = require('@mpieva/psydb-schema-fields');

var CoreBodySchema = () => {
    var schema = OpenObject({
        properties: {
            recordType: IdentifierString(), // FIXME: enum
            target: StringEnum([ 'table', 'optionlist' ]),
        },
        required: []
    });

    return schema;
}

module.exports = CoreBodySchema;
