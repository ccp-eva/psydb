'use strict';
var { ClosedObject, StringEnum } = require('@mpieva/psydb-schema-fields');

var Sort = (bag = {}) => {
    return ClosedObject({
        path: {
            type: 'string', // FIXME: json pointer ?
            minLength: 1,
        },
        direction: StringEnum([ 'asc', 'desc' ])
    })
}

module.exports = { Sort };
