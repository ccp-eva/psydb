'use strict';
var { getDemappedCols } = require('../utils');

var CSVSubjectContactHistoryColumnRemapper = (bag) => {
    var remapper = {};
    
    remapper.csv2obj = (bag) => {
        var { colkey: col } = bag;
        
        if (col === 'subjectId') {
            return 'subjectId';
        }
        if (col === 'contactType') {
            return 'contactType';
        }
        if (col === 'date') {
            return 'date';
        }
        if (col === 'time') {
            return 'time';
        }
        if (col === 'comment') {
            return 'comment';
        }
    }

    remapper.ajvpath2csv = remapper.obj2csv = (bag) => {
        var { path } = bag;

        var mapping = {
            subjectId: [{ key: 'subjectId', type: 'scalar' }],
            contactType: [{ key: 'contactType', type: 'scalar' }],
            date: [{ key: 'date', type: 'scalar' }],
            time: [{ key: 'time', type: 'scalar' }],
            comment: [{ key: 'comment', type: 'scalar' }],
        }

        return getDemappedCols({ path, mapping });
    }
    
    return remapper;
}

module.exports = CSVSubjectContactHistoryColumnRemapper;
