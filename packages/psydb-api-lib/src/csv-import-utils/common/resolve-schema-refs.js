'use strict';
var gatherPossibleJSSPaths = require('@cdxoo/gather-possible-jss-paths');

var resolveSchemaRefs = (bag) => {
    var { fromItems, schema } = bag;
    var paths = gatherPossibleJSSPaths(
        schema, { includeSchemaInPathTokens: true }
    );

}

module.exports = resolveSchemaRefs;
