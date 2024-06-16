'use strict';
var gatherPossibleJSSPaths = require('@cdxoo/gather-possible-jss-paths');

var isRecordRef = (systemType) => (
    systemType === 'ForeignId' || systemType === 'ForeignIdList'
)
var isHSIRef = (systemType) => (
    systemType === 'HelperSetItemId' || systemType === 'HelperSetItemIdList'
)
var isRefList = (systemType) => (
    systemType === 'ForeignIdList' || systemType === 'HelperSetItemIdList'
)

var resolveSchemaRefs = async (bag) => {
    var { 
        db, fromItems, schema,
        extraRecordResolvePointers = {},
    } = bag;
    
    var paths = gatherPossibleJSSPaths(
        schema, { includeSchemaInPathTokens: true }
    );

    // XXX: we have allOf in SaneString and that will create
    // extra paths; we will add a naively filter this for now
    var recordPaths = [];
    var hsiPaths = [];
    for (var it of paths) {
        var [ leaf ] = it.slice(-1);

        var pointer = pointerize(it);

        var { schema } = leaf;
        if (isRefList(systemType)) {
            schema = leaf.schema.items;
        }
        
        var augmented = {
            schema,
            pointer,
            path: it,
        }
        
        var { systemType } = schema;
        if (isRecordRef(systemType)) {
            recordPaths.push(augmented);
        }
        if (isHSIRef(systemType)) {
            hsiPaths.push(augmented);
        }
    }
    console.dir(recordPaths, { depth: null });
}

var pointerize = (path) => {
    var out = '';
    for (var it of path) {
        var { key } = it;
        out += `/${key}`;
    }
    return out;
}

module.exports = resolveSchemaRefs;
