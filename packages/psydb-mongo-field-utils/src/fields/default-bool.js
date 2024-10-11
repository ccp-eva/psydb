'use strict';
var { 
    switchQueryFilterType,
    convertPointerKeys,
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

    return convertPointerKeys(filter);
}

module.exports = {
    createQueryFilter,
}
