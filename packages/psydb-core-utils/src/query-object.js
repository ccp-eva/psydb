'use strict';
var { isPlainObject, isArray } = require('is-what');
var arrify = require('./arrify');

var queryObject = (bag) => {
    var { from, path } = bag;

    var tokens = path.split('.');
    var current = from;
    for (var ix = 0; ix < tokens.length; ix += 1) {
        var token = tokens[ix];
        
        if (isArray(current)) {
            current = (
                current
                .filter((it) => (
                    isPlainObject(it) || isArray(it)
                ))
                .reduce((acc, it) => {
                    var v = (
                        isPlainObject
                        ? arrify(it[token])
                        : it
                    );
                    return [
                        ...acc, ...arrify(v)
                    ];
                }, [])
                .filter(it => it !== undefined)
            )
        }
        else if (!isPlainObject(current)) {
            current = undefined;
        }
        else {
            current = current[token];
        }
    }

    return current;
}

module.exports = queryObject;
