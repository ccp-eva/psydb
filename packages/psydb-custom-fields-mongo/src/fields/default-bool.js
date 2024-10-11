'use strict';
var { 
    switchQueryFilterType,
    Boolify,
} = require('../utils');

var createQueryFilter = (bag) => {
    var { type, definition, input } = bag;
    var { pointer } = definition;
   
    var filter = switchQueryFilterType({
        'extended-search': () => Boolify(pointer, input, [
            'only-true', 'only-false'
        ]),
        'quick-search': () => { throw new Error() }
    })(type);

    return filter;
}

module.exports = {
    createQueryFilter,
}
