'use strict';
var { 
    switchQueryFilterType,
    Boolify, JustEqual,
} = require('../utils');

var createQueryFilter = (bag) => {
    var { type, definition, input } = bag;
    var { pointer } = definition;
   
    var filter = switchQueryFilterType({
        'extended-search': () => Boolify(pointer, input, [
            'only-true', 'only-false'
        ]),
        'quick-search': () => JustEqual(pointer, input)
    })(type);

    return filter;
}

module.exports = {
    createQueryFilter,
}
