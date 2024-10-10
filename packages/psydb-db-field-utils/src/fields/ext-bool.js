'use strict';
var { 
    switchQueryFilterType,
    InTruthyKeys
} = require('../utils');

var createQueryFilter = (bag) => {
    var { type, definition, input } = bag;
    var { pointer } = definition;
   
    return switchQueryFilterType({
        'extended-search': () => InTruthyKeys(pointer, input);
        'quick-search': () => { throw new Error() }
    })(type);
}

module.exports = {
    createQueryFilter,
}
