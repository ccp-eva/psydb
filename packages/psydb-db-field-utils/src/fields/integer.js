'use strict';
var { 
    switchQueryFilterType,
    PointWithinOurRange
} = require('../utils');

var createQueryFilter = (bag) => {
    var { type, definition, input } = bag;
    var { pointer } = definition;
   
    return switchQueryFilterType({
        'extended-search': () => PointWithinOurRange(pointer, input);
        'quick-search': () => { throw new Error() }
    })(type);
}

module.exports = {
    createQueryFilter,
}
