'use strict';
var { 
    switchQueryFilterType,
    EqualsOneOfTruthyKeys,
} = require('../utils');

var createQueryFilter = (bag) => {
    var { type, definition, input } = bag;
    var { pointer } = definition;
   
    var filter = switchQueryFilterType({
        'extended-search': () => EqualsOneOfTruthyKeys(pointer, input),
        'quick-search': () => { throw new Error() }
    })(type);

    return filter;
}

module.exports = {
    createQueryFilter,
}
