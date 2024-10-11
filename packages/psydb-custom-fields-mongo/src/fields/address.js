'use strict';
var { 
    switchQueryFilterType,
    MultiRegex
} = require('../utils');

var createQueryFilter = (bag) => {
    var { type, definition, input } = bag;
    var { pointer } = definition;
   
    var filter = switchQueryFilterType({
        'extended-search': () => MultiRegex(pointer, input, [
            'country', 'city', 'postcode',
            'street', 'housenumber', 'affix',
        ]),
        'quick-search': () => { throw new Error() }
    })(type);

    return filter;
}

module.exports = {
    createQueryFilter,
}
