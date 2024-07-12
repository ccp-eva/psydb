'use strict';

var customColumnRemap = (col) => {
    if (col === 'date') {
        return 'date';
    }
    if (col === 'time') {
        return 'time';
    }
    if (col === 'location') {
        return 'locationId';
    }
    if (/^experimenter(\[\d+\])?$/.test(col)) {
        var arraySuffix = col.replace(/^experimenter/, '') || '[0]';
        return `experimentOperatorIds${arraySuffix}`;
    }
    if (col === 'subject') {
        return 'subjectData[0].subjectId';
    }
    if (col === 'comment') {
        return 'subjectData[0].comment';
    }
}

module.exports = customColumnRemap;
