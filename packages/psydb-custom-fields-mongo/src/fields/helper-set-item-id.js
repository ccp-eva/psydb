'use strict';
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');
var { 
    switchQueryFilterType,
    EqualsOneOf, JustEqual,
} = require('../utils');

var createQueryFilter = (bag) => {
    var { type, definition, input } = bag;
    var { pointer } = definition;
  
    var options = { transform: ObjectId };
    var filter = switchQueryFilterType({
        'extended-search': () => EqualsOneOf(pointer, input, options),
        'quick-search': () => JustEqual(pointer, input)
    })(type);

    return filter;
}

module.exports = {
    createQueryFilter,
}
