'use strict';
var { OpenObject, StringEnum } = require('@mpieva/psydb-schema-fields');

var CoreBodySchema = () => {
    var schema = OpenObject({
        properties: {
            'target': StringEnum([ 'table', 'optionlist' ]),
        },
        required: []
    });

    return schema;
}

module.exports = CoreBodySchema;
