'use strict';

var customColumnRemap = (col) => {
    if (col === 'date') {
        return 'date';
    }
    if (col === 'time') {
        return 'time';
    }
    if (col === 'subject') {
        return 'subjectData[0].subjectId';
    }
}

module.exports = customColumnRemap;
