'use strict';
var mapObject = require('map-obj');

var mongoEscapeDeep = (payload) => {
    var escaped = mapObject(payload, (key, value) => {
        var escapedKey = key;
        if (key.startsWith('$')) {
            escapedKey = `#${key}`;
        }
        else if (/\./.test(key)) {
            escapedKey = convertPathToPointer(key);
        }

        return [ escapedKey, value ]
    }, { deep: true });

    return escaped;
}

var convertPathToPointer = (path) => {
    var tokens = path.split('.');
    var matcher = /[\/\.]/g;
    var escaper = (m) => {
        switch (m) {
            case '~': return '~0';
            case '/': return '~1';
        }
    }
    tokens = tokens.map(it => (
        it
        ? it.replace(matcher, escaper)
        : it // FIXME: throw error here?
    ));

    return '/' + tokens.join('/');
}

module.exports = mongoEscapeDeep;
