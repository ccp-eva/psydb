'use strict';
var { without, entries } = require('/psydb-core-utils');
var { inline } = require('../externals');

var verifyNoMissingHandlers = (bag) => {
    var {
        collections: collectionsToCheck,
        ...todo
    } = bag;
    
    for (var [ key, handlers ] of entries(todo)) {
        var missing = without({
            that: collectionsToCheck,
            without: Object.keys(handlers)
        })
        if (missing.length > 0 ) {
            throw new Error(inline`
                Missing Collection Handlers for "${key}":
                ${missing.join()}
            `);
        }
    }
}

module.exports = verifyNoMissingHandlers;
