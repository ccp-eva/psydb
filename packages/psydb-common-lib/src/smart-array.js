'use strict';
var { arrify } = require('@mpieva/psydb-core-utils');

// NOTE: mostly used when composing stages
var SmartArray = (ary, options = {}) => {
    // FIXME: i think ill switch to default = true here
    var { spreadArrayItems = false } = options;
    var out = [];
    for (var it of ary) {
        if (it) {
            if (typeof it === 'function') {
                it = it();
            }

            out.push(...(
                spreadArrayItems
                ? arrify(it)
                : [ it ]
            ));
        }
    }
    return out;
}

module.exports = SmartArray;
