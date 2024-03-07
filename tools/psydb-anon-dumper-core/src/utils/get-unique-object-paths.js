'use strict';
var { isPlainObject, unique } = require('@mpieva/psydb-core-utils');
var {
    ObjectId,
    traverse,
    stringifyPath,
} = require('../externals');


var getUniqueObjectPaths = (that, options = {}) => {
    var {
        delimiter = '.',
    } = options;

    var arrayPaths = {};
    var out = {};

    var traverseOptions = {
        traverseArrays: true,
        createPathToken: (context) => {
            var { key, value, parentNode } = context;
            
            var type = undefined;
            if (Array.isArray(value)) {
                type = 'array';
            }
            else if (isPlainObject(value)) {
                type = 'object';
            }
            else if (value instanceof Date) {
                type = 'Date'
            }
            else if (value instanceof ObjectId) {
                type = 'ObjectId'
            }
            else if (value === null) {
                type = 'NULL';
            }
            else {
                type = typeof value;
            }

            var parentType = parentNode?.path.slice(-1)[0]?.type;

            return { key, type, parentType };
        }
    }

    traverse(that, (context) => {
        var { isLeaf, path, value, parentNode } = context;

        // skip root node
        if (parentNode) {
            var collapsedPath = path.filter(
                tok => tok.parentType !== 'array'
            );

            var key = stringifyPath(collapsedPath);
            out[key] = collapsedPath;
        }
    }, traverseOptions);

    var sane = Object.values(out);

    return sane;
}

module.exports = getUniqueObjectPaths;
