'use strict';
var { 
    switchQueryFilterType,
    Boolify,
} = require('../utils');

var createQueryFilter = (bag) => {
    var { type, definition, input } = bag;
    var { pointer } = definition;
   
    return switchQueryFilterType({
        'extended-search': () => Boolify(pointer, input, [
            'only-true', 'only-false'
        ]);
        'quick-search': () => { throw new Error() }
    })(type);
}

module.exports = {
    createQueryFilter,
}
