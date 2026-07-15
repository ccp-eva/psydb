'use strict';
var { pathify, merge, seperateNulls } = require('@mpieva/psydb-core-utils');
var createSchemaDefaults = require('./create-schema-defaults');

var prepareStateUpdate = (bag) => {
    var { schema, values, subChannel } = bag;

    var prefix = (
        subChannel
        ? `${subChannel}.state`
        : 'state'
    );

    var pathified = pathify(merge(
        schema ? createSchemaDefaults(schema) : {},
        values
    ), { prefix });

    // NOTE: mongodb does not allow nested $set path on values that are null
    // i.e. 'state.foo' = null and { $set: 'state.foo.a': 42 }
    // NOTE: splitting also affects isNullable DateTime values unfortnately
    var { values: SET, nulls: UNSET } = seperateNulls({
        from: pathified,
        nullReplacer: 1, omitEmpty: true
    });

    return { SET, UNSET };
}

module.exports = prepareStateUpdate;
