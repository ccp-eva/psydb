'use strict';
var { 
    switchQueryFilterType,
    JustRegex
} = require('../utils');

var createQueryFilter = (bag) => {
    var { type, definition, input } = bag;
    var { pointer } = definition;
    
    return switchQueryFilterType({
        'extended-search': () => JustRegex(`${pointer}/email`, input),
        'quick-search': () => JustRegex(`${pointer}/email`, input),
    })(type);
}

module.exports = {
    createQueryFilter,
}
