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

    var staticMapping = {
        'comment': 'scientific.state.comment',
    };

    var customMapping = {};
    for (var it of subjectCRT.allCustomFields()) {
        var { key, subChannel, pointer } = it;
        var mkey = (
            dups.includes(key) || staticMapping[key]
            ? `subChannel.${key}`
            : key
        );
        customMapping[mkey] = convertPointerToPath(pointer);
    }

    var mapping = {
        ...staticMapping,
        ...customMapping,
    }
    var remap = (col) => {
        return mapping[col]
    }

    return remap;
}

module.exports = ColumnRemapper;
