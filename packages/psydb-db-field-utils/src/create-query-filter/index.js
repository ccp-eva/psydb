'use strict';
var createExtendedSearchFilter = require('./extended-search');
var createQuickSearchFilter = require('./quick-search');

var createQueryFilter = (bag) => {
    var { type, definition, input } = bag;
    switch (type) {
        case 'extended-search':
            return createExtendedSearchFilter({ definition, input });
        case 'quick-search':
            return createQuickSearchFilter({ definition, input });
        default:
            throw new Error(`unknown type "${type}"`);
    }
}
