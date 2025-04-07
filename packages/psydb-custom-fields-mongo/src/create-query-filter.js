'use strict';
var Fields = require('./fields');

var createQueryFilter = (bag) => {
    var { type, definition, input } = bag;
    var systemType = definition.systemType || definition.type; // FIXME

    return Fields[systemType]({ type, definition, input });
}

module.exports = createQueryFilter;
