'use strict';
var gatherPossibleJSSPaths = require('@cdxoo/gather-possible-jss-paths');
var perlify = require('@cdxoo/stringify-path-perlstyle');

var {
    isArray,
    keyBy,
    groupBy,
    traverse,
} = require('@mpieva/psydb-core-utils');

var isRecordRef = (systemType) => (
    systemType === 'ForeignId' || systemType === 'ForeignIdList'
)
var isHSIRef = (systemType) => (
    systemType === 'HelperSetItemId' || systemType === 'HelperSetItemIdList'
)
var isRefList = (systemType) => (
    systemType === 'ForeignIdList' || systemType === 'HelperSetItemIdList'
)

var gatherSchemaRefs = async (bag) => {
    var { fromItems, schema } = bag;

    // XXX: in theory we have an issue
    // in gatherPossibleJSSPaths() where ambigous paths could be created
    // we weill be ignoring this for now as it seems a non issue here
    var resolveData = gatherResolveDataFromSchema({ schema });
    var resolveDataByPerl = keyBy({ items: resolveData, byProp: 'perlpath' });

    var tokenMapping = [];
    for (var [ ix, it ] of fromItems.entries()) {
        tokenMapping[ix] = [];

        traverse(it, (context) => {
            var { isLeaf, path, value } = context;
            if (isLeaf) {
                var csvColumn = urlify(path);
                var dataPointer = pointerize(path);
                
                var strippedPath = path.filter(it => !it.isArrayItem);
                var schemaPerlPath = perlify(strippedPath);

                var resdata = resolveDataByPerl[schemaPerlPath];
                if (resdata) {
                    var { schema } = resdata;
                    var { systemType, systemProps } = schema;
                    
                    var shared = {
                        csvColumn,
                        schemaPerlPath,
                        dataPointer,
                        dataPath: path,
                        systemType,
                        value
                    };
            
                    if (isRecordRef(systemType)) {
                        var { collection } = systemProps;
                        tokenMapping[ix].push({ ...shared, collection });
                    }
                    if (isHSIRef(systemType)) {
                        var { setId } = systemProps;
                        tokenMapping[ix].push({
                            ...shared, collection: 'helperSetItem', setId
                        });
                    }
                }
            }
        }, {
            traverseArrays: true,
            createPathToken: ({ parentNode, key, value }) => ({
                key,
                type: isArray(value) ? 'array' : typeof value,
                isArrayItem: isArray(parentNode.value),
            })
        });
    }

    var { helperSetItem: hsiIntermediate, ...recordRefs } = groupBy({
        items: tokenMapping,
        byProp: 'collection',
        transform: it => (it.setId ? it : it.value)
    });

    var hsiRefs = groupBy({
        items: hsiIntermediate || [],
        byProp: 'setId',
        transform: it => it.value
    });

    return { recordRefs, hsiRefs, tokenMapping }
}

var gatherResolveDataFromSchema = (bag) => {
    var { schema } = bag;
    var paths = gatherPossibleJSSPaths(
        schema, { includeSchemaInPathTokens: true }
    );

    // XXX: we have allOf in SaneString and that will create
    // extra paths; we will add a naively filter this for now
    var resolveData = [];
    for (var it of paths) {
        var [ leaf ] = it.slice(-1);
        var { schema } = leaf;
        var { systemType } = schema;

        if (isRefList(systemType)) {
            schema = leaf.schema.items;
        }
        
        var data = { schema, perlpath: perlify(it), fullTokens: it }
        
        if (isRecordRef(systemType) || isHSIRef(systemType)) {
            resolveData.push(data);
        }
    }

    return resolveData
}

var pointerize = (path) => {
    var out = '';
    for (var it of path) {
        var { key } = it;
        out += `/${key}`;
    }
    return out;
}

var urlify = (path) => {
    var str = '';
    for (var [ix, it] of path.entries()) {
        var { key, isArrayItem } = it;
        if (it.isArrayItem) {
            str += `[${key}]`
        }
        else {
            str += (ix !== 0 ? '.' : '') + key
        }
    }
    return str;
}

module.exports = gatherSchemaRefs;
