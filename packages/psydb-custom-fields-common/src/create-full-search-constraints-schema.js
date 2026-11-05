'use strict';
var { __fixDefinitions } = require('@mpieva/psydb-common-compat');
var { MaxObject } = require('@mpieva/psydb-schema-fields');
var Fields = require('./fields');

var createFullSearchConstraintsSchema = (bag) => {
    var { definitions } = bag;
    definitions = __fixDefinitions(definitions); // FIXME

    var schema = MaxObject({});
    for (var it of definitions) {
        var { pointer, systemType } = it;

        var field = Fields[systemType];
        if (field.createSearchConstraintsSchema) {
            schema.properties[pointer] = field.createSearchConstraintsSchema({
                definition: it
            });
        }
    }

    return schema;
}

module.exports = createFullSearchConstraintsSchema;
