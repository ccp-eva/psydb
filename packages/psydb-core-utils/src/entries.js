'use strict';
var entries = (that) => {
    var out = (
        Object.keys(that)
        .map(key => ([
            key, that[key]
        ]))
    );

    if (Array.isArray(that)) {
        out = out.map(([ key, value ]) => ([ parseInt(key), value ]))
    }

    return out;
};
module.exports = entries;
