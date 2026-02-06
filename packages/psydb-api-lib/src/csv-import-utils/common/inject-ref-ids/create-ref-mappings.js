'use strict';
var perlify = require('@cdxoo/stringify-path-perlstyle');
var { isArray, keyBy, traverse } = require('@mpieva/psydb-core-utils');

var {
    isRecordRef, isHSIRef, isRefList,
} = require('@mpieva/psydb-schema-utils');

var createRefMappings = (bag) => {
    var { refData, items } = bag;

    // XXX: in theory we have an issue
    // in gatherPossibleJSSPaths() where ambigous paths could be created
    // we weill be ignoring this for now as it seems a non issue here
    var refDataByPerl = keyBy({ items: refData, byProp: 'perlpath' });

    var refMappings = [];
    for (var [ ix, it ] of items.entries()) {
        refMappings[ix] = [];

        traverse(it, (context) => {
            var { isLeaf, path, value } = context;
            if (isLeaf) {
                var csvColumn = urlify(path);
                var dataPointer = pointerize(path);
                
                var strippedPath = path.filter(it => !it.isArrayItem);
                var schemaPerlPath = perlify(strippedPath);

                var resdata = refDataByPerl[schemaPerlPath];
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
                        var { collection, recordType } = systemProps;
                        refMappings[ix].push({
                            ...shared, collection, recordType
                        });
                    }
                    if (isHSIRef(systemType)) {
                        var { setId } = systemProps;
                        refMappings[ix].push({
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

    return refMappings
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

module.exports = createRefMappings;
