'use strict';
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');
var { 
    switchQueryFilterType,
    IncludesOneOf
} = require('../utils');

var createQueryFilter = (bag) => {
    var { type, definition, input } = bag;
    var { pointer } = definition;
  
    var options = { transform: ObjectId };
    var filter = switchQueryFilterType({
        'extended-search': () => IncludesOneOf(pointer, input, options),
        'quick-search': () => { throw new Error() }
    })(type);

    return filter;
}

module.exports = {
    createQueryFilter,
}
