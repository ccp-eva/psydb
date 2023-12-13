'use strict';
var debug = require('@cdxoo/debug-js-fork')(
    'psydb:api-lib:gatherAllRefValues'
);

var {
    arrify,
    convertSchemaPointerToMongoPath,
    queryObject,
    forcePush,
} = require('@mpieva/psydb-core-utils');


var gatherAllRefValues = (bag) => {
    debug('start gatherAllRefValues()');
    var { possibleRefs, from } = bag;

    // FIXME: this works only wehn we have no id collisions
    // accross collections, which might not be the case
    var gathered = {};
    var t_query = 0;
    var t_push = 0;
    
    for (var ref of possibleRefs) {
        var { schemaPointer, systemType, systemProps } = ref;
        var path = convertSchemaPointerToMongoPath(schemaPointer);

        ref.path = path;
    }

    var records = arrify(from);
    for (var record of records) {
        for (var ref of possibleRefs) {
            var { path, schemaPointer, systemType, systemProps } = ref;

            var t = new Date();
            var result = queryObject({
                from: record,
                path
            });
            t_query += (new Date() - t);

            //console.log({ path, result, data: record.state })

            if (result) {
                var pointer;
                if (systemType === 'ForeignId') {
                    pointer = `/records/${systemProps.collection}/ids`;
                }
                else if (systemType === 'HelperSetItemId') {
                    pointer = '/helperSetItems/ids';
                }
                else if (systemType === 'CustomRecordTypeKey') {
                    pointer = `/crts/${systemProps.collection}/types`
                }

                var t2 = new Date();
                forcePush({
                    into: gathered,
                    pointer,
                    values: arrify(result)
                });
                t_push += (new Date() - t2);
            }
        }
    }
    debug({ t_query, t_push })

    return gathered;
}

module.exports = gatherAllRefValues;
