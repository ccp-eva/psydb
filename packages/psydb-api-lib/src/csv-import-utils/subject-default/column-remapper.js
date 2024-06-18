'use strict';
var {
    entries,
    groupBy,
    convertPointerToPath
} = require('@mpieva/psydb-core-utils');

var ColumnRemapper = ({ subjectCRT }) => {
    var definitions = subjectCRT.allCustomFields();
    
    var dups = entries(
        groupBy({ items: definitions, byProp: 'key' })
    ).filter(([key, items]) => items.length > 1).map(it => it.key);

    var mapping = {};
    for (var it of subjectCRT.allCustomFields()) {
        var { key, subChannel, pointer } = it;
        var mkey = dups.includes(key) ? `subChannel.${key}` : key

        mapping[mkey] = convertPointerToPath(pointer);
    }

    var remap = (col) => {
        return mapping[col]
    }

    return remap;
}

module.exports = ColumnRemapper;
