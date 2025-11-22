'use strict';
var seperateNulls = (bag) => {
    var {
        from: obj,
        nullReplacer = null,
        omitEmpty = false,
    } = bag;

    var values = {};
    var nulls = {};
    for (var key of Object.keys(obj)) {
        var v = obj[key];
        if (v === null) {
            nulls[key] = nullReplacer;
        }
        else {
            values[key] = v;
        }
    }

    if (omitEmpty) {
        return {
            ...(Object.keys(values).length > 0 && { values }),
            ...(Object.keys(nulls).length > 0 && { nulls }),
        }
    }
    else {
        return { values, nulls };
    }
}

module.exports = seperateNulls;
