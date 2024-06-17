'use strict';
var gatherPossibleJSSPaths = require('@cdxoo/gather-possible-jss-paths');
var { unwind, jsonpointer, forcePush } = require('@mpieva/psydb-core-utils');

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
    var { 
        db, fromItems, schema,
        extraRecordResolvePointers = {},
    } = bag;
   
    var resolveData = gatherResolveDataFromSchema({ schema });

    var recordRefs = {};
    var hsiRefs = {};

    for (var it of fromItems) {
        for (var resdata of resolveData) {
            var { schema, pointer, path } = resdata;
            var { systemType, systemProps } = schema;
            
            var unwound = unwind({
                items: [ it ],
                byPath: path.replace(/\.[^\.]+$/, '')
            });

            var values = [];
            for (var u of unwound) {
                values.push(jsonpointer.get(u, pointer))
            }

            if (isRecordRef(systemType)) {
                var { collection } = systemProps;
                forcePush({
                    into: recordRefs,  pointer: `/${collection}`, values
                })
            }
            if (isHSIRef(systemType)) {
                var { setId } = systemProps;
                forcePush({
                    into: hsiRefs,  pointer: `/${setId}`, values,
                })
            }

        }
    }

    return { recordRefs, hsiRefs }
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
        if (isRefList(systemType)) {
            schema = leaf.schema.items;
        }
        
        var data = {
            schema,
            pointer: pointerize(it),
            path: pathify(it),
            fullTokens: it
        }
        
        var { systemType } = schema;
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

var pathify = (path) => {
    var str = path.map(it => it.key).join('.');
    return str;
}

module.exports = gatherSchemaRefs;
