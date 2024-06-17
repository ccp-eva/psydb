'use strict';

var customColumnRemap = (col) => {
    if (col === 'experiment_name') {
        return 'experimentName';
    }
    if (col === 'room_or_enclosure') {
        return 'roomOrEnclosure';
    }
    if (/^participant/.test(col)) {
        var [ _unused, ix = 0 ] = col.split('_');
        return `subjectData[${ix}].subjectId`;
    }
    if (/^role/.test(col)) {
        var [ _unused, ix = 0 ] = col.split('_');
        return `subjectData[${ix}].role`;
    }

    return col;
}

module.exports = customColumnRemap;
