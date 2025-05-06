'use strict';
var { convertPointerToPath } = require('@mpieva/psydb-core-utils');
var { makeRX } = require('@mpieva/psydb-common-lib');
var { 
    switchQueryFilterType,
    PointWithinOurRange
} = require('../utils');

var createQueryFilter = (bag) => {
    var { type, definition, input } = bag;
    var { pointer } = definition;
   
    var filter = switchQueryFilterType({
        'extended-search': () => PointWithinOurRange(pointer, input),
        'quick-search': () => {
            var path = convertPointerToPath(pointer);

            return { $expr: { $regex: {
                input: { $toString: `$${path}` },
                regex: makeRX(input),
            }}}
        }
    })(type);

    return filter;
}

module.exports = {
    createQueryFilter,
}
