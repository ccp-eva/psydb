'use strict';
var { __fixDefinitions } = require('@mpieva/psydb-common-lib');
var { MaxObject } = require('@mpieva/psydb-schema-fields');
var Fields = require('./fields');

var createFullQuickSearchSchema = (bag) => {
    var { definitions } = bag;
    definitions = __fixDefinitions(definitions); // FIXME

    var schema = MaxObject({});
    for (var it of definitions) {
        var { pointer, systemType } = it;

        var field = Fields[systemType];
        if (field.createQuickSearchSchema) {
            schema.properties[pointer] = field.createQuickSearchSchema({
                definition: it
            });
        }
    }

    return schema;
}

module.exports = createFullQuickSearchSchema;
