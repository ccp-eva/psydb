
'use strict';

var isObject = (that) => typeof that === 'object';
var isArray = (that) => Array.isArray(that);

var queryObject = (bag) => {
    var { from, path } = bag;

    var tokens = path.split('.');
    var current = from;
    for (var ix = 0; ix < tokens.length; ix += 1) {
        var token = tokens[ix];
        
        if (!isObject(current)) {
            current = undefined;
            break;
        }

        if (isArray(current)) {
            current = (
                current
                .filter(isObject)
                .map(it => it[token])
                .filter(it => it !== undefined)
            )
        }
        else {
            current = current[token];
        }
    }

    return current;
}

module.exports = queryObject;
