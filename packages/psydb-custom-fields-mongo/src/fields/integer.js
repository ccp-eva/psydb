'use strict';
var { 
    switchQueryFilterType,
    PointWithinOurRange
} = require('../utils');

var createQueryFilter = (bag) => {
    var { type, definition, input } = bag;
    var { pointer } = definition;
   
    var filter = switchQueryFilterType({
        'extended-search': () => PointWithinOurRange(pointer, input),
        'quick-search': () => { throw new Error() }
    })(type);

    return filter;
}

module.exports = {
    createQueryFilter,
}
