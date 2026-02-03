'use strict';
var { makeDiaRX } = require('@mpieva/psydb-common-lib');

var { 
    switchQueryFilterType,
    __JustOneOf
} = require('../utils');

var createQueryFilter = (bag) => {
    var { type, definition, input } = bag;
    var { pointer } = definition;
    
    var options = { transform: makeDiaRX };
    var filter = switchQueryFilterType({
        'extended-search': () => __JustOneOf(pointer, input, options),
        'quick-search': () => JustOneOf(pointer, input, options),
    })(type);

    return filter;
}

module.exports = {
    createQueryFilter,
}
