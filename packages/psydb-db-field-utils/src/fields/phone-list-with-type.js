'use strict';
var { 
    switchQueryFilterType,
    JustRegex
} = require('../utils');

var createQueryFilter = (bag) => {
    var { type, definition, input } = bag;
    var { pointer } = definition;
    
    return switchQueryFilterType({
        'extended-search': () => JustRegex(`${pointer}/number`, input),
        'quick-search': () => JustRegex(`${pointer}/number`, input),
    })(type);
}

module.exports = {
    createQueryFilter,
}
