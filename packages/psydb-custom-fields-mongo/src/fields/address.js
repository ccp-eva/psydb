'use strict';
var { 
    switchQueryFilterType,
    MultiEqual, MultiRegex, ConcatRegex,
} = require('../utils');

var createQueryFilter = (bag) => {
    var { type, definition, input } = bag;
    var { pointer } = definition;
   
    var filter = switchQueryFilterType({
        'extended-search': () => ({
            ...MultiEqual(pointer, input, [
                'country'
            ]),
            ...MultiRegex(pointer, input, [
                'city', 'postcode',
                'street', 'housenumber', 'affix',
            ])
        }),

        'quick-search': () => ConcatRegex(pointer, input, [
            'street', 'housenumber', 'affix',
            'postcode', 'city'
        ]),
        //'quick-search': () => { throw new Error() }
    })(type);

    return filter;
}

module.exports = {
    createQueryFilter,
}
