'use strict';
var { 
    switchQueryFilterType,
    MultiRegex
} = require('../utils');

var createQueryFilter = (bag) => {
    var { type, definition, input } = bag;
    var { pointer } = definition;
   
    return switchQueryFilterType({
        'extended-search': () => MultiRegex(pointer, input, [
            'country', 'city', 'postcode',
            'street', 'housenumber', 'affix',
        ]);
        'quick-search': () => { throw new Error() }
    })(type);
}

module.exports = {
    createQueryFilter,
}
