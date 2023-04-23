'use strict';
var { BasicObject } = require('@mpieva/psydb-schema-fields');

var SearchConstraints = (bag) => {
    var { availableConstraints } = bag;
    return BasicObject({ ...availableConstraints })
}

module.exports = { SearchConstraints };
