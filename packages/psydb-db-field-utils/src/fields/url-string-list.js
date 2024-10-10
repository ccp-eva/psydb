'use strict';
var { 
    switchQueryFilterType,
    convertPointerKeys,
    JustRegex
} = require('../utils');

var createQueryFilter = (bag) => {
    var { type, definition, input } = bag;
    var { pointer } = definition;
    
    var filter = switchQueryFilterType({
        'extended-search': () => JustRegex(pointer, input),
        'quick-search': () => JustRegex(pointer, input),
    })(type);

    return convertPointerKeys(filter);
}

module.exports = {
    createQueryFilter,
}
