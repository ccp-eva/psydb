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
        'extended-search': () => JustRegex(`${pointer}/number`, input),
        'quick-search': () => JustRegex(`${pointer}/number`, input),
    })(type);

    return convertPointerKeys(filter);
}

module.exports = {
    createQueryFilter,
}
