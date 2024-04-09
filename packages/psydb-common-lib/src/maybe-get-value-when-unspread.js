'use strict';

var maybeGetValueWhenUnspread = (obj, pointer) => {
    var [ _yoink, ...tokens ] = pointer.split('/');

    var value = obj;
    for (var tok of tokens) {
        value = value[tok];
        if (Array.isArray(value)) {
            if (value.length !== 1) {
                return { hasSpread: true, value }
            }
        }
    }

    return { hasSpead: false, value }
}

module.exports = maybeGetValueWhenUnspread;
