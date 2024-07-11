'use strict';
var gatherPossibleJSSPaths = require('@cdxoo/gather-possible-jss-paths');
var perlify = require('@cdxoo/stringify-path-perlstyle');

var { isRefList, isRecordRef, isHSIRef } = require('./what-system-type');

var gatherPossibleRefsFromSchema = (bag) => {
    var { schema } = bag;
    var paths = gatherPossibleJSSPaths(
        schema, { includeSchemaInPathTokens: true }
    );

    // XXX: we have allOf in SaneString and that will create
    // extra paths; we will add a naively filter this for now
    var refData = [];
    for (var it of paths) {
        var [ leaf ] = it.slice(-1);
        var { schema } = leaf;
        var { systemType } = schema;

        if (isRefList(systemType)) {
            schema = leaf.schema.items;
        }
        
        var data = { schema, perlpath: perlify(it), fullpath: it }
        
        if (isRecordRef(systemType) || isHSIRef(systemType)) {
            refData.push(data);
        }
    }

    return refData
}

module.exports = gatherPossibleRefsFromSchema;
