'use strict';
var {
    arrify,
    convertSchemaPointerToMongoPath,
    queryObject,
    forcePush,
} = require('@mpieva/psydb-core-utils');


var gatherAllRefValues = (bag) => {
    var { possibleRefs, from: record } = bag;

    // FIXME: this works only wehn we have no id collisions
    // accross collections, which might not be the case
    var gathered = {};
    for (var ref of possibleRefs) {
        var { schemaPointer, systemType, systemProps } = ref;
        var path = convertSchemaPointerToMongoPath(schemaPointer);

        var result = queryObject({
            from: record,
            path
        });

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

            forcePush({
                into: gathered,
                pointer,
                values: arrify(result)
            });
        }
    }

    return gathered;
}

module.exports = gatherAllRefValues;
