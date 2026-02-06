'use strict';
var { 
    switchQueryFilterType,
    JustRegex
} = require('../utils');

var createQueryFilter = (bag) => {
    var { type, definition, input } = bag;
    var { pointer } = definition;
    
    var filter = switchQueryFilterType({
        'extended-search': () => JustRegex(pointer, input),
        'quick-search': () => JustRegex(pointer, input),
    })(type);

    return filter;
}

module.exports = {
    createQueryFilter,
}
