'use strict';
var { 
    switchQueryFilterType,
    EqualsOneOfTruthyKeys, JustEqual,
} = require('../utils');

var createQueryFilter = (bag) => {
    var { type, definition, input } = bag;
    var { pointer } = definition;
   
    var filter = switchQueryFilterType({
        'extended-search': () => EqualsOneOfTruthyKeys(pointer, input),
        'quick-search': () => JustEqual(pointer, input),
    })(type);

    return filter;
}

module.exports = {
    createQueryFilter,
}
