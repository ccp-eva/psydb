'use strict';
var debug = require('../debug')('checkAnonymizers');

var { entries, without } = require('@mpieva/psydb-core-utils');
var { inline, gatherPossibleJSSPaths } = require('../externals');


var checkAnonymizers = async (bag) => {
    var { config, schemas, anonymizers } = bag;
    var { onlyCollections, skippedCollections } = config;

    debug('checking anonymizers');
    for (var [ collection, Schema ] of entries(schemas)) {

        if (skippedCollections.includes(collection)) {
            debug(`    ${collection} => skipped`);
            continue;
        }

        debug(`    ${collection}`);

        var schema = Schema().createJSONSchema();
        var schemaPaths = gatherPossibleJSSPaths(
            schema, { includeSchemaInPathTokens: true }
        );
        var anonTs = [];
        for (var p of schemaPaths) {
            var [ leaf ] = [ ...p ].reverse();
            if (leaf.schema.anonT) {
                anonTs.push(leaf.schema.anonT)
            }
        }

        var anonymizer = anonymizers[collection];
        var missing = without({
            that: anonTs,
            without: Object.keys(anonymizer.hooks)
        })
        if (missing.length > 0 ) {
            throw new Error(inline`
                Missing Anonymizer Hook for "${collection}":
                ${missing.join()}
            `);
        }
    }
}

module.exports = checkAnonymizers;
