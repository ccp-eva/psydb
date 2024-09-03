'use strict';
var { getDemappedCols } = require('../utils');

var CSVOnlineSurveyColumnRemapper = (bag) => {
    var remapper = {};
    
    remapper.csv2obj = (bag) => {
        var { colkey: col } = bag;
        
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

    remapper.obj2csv = (bag) => {
        var { path } = bag;

        var mapping = {
            date: [{ key: 'date', type: 'scalar' }],
            time: [{ key: 'time', type: 'scalar' }],
            subject: [
                { key: 'subjectData', type: 'array' },
                { key: 'subjectId', type: 'scalar' }
            ],
        }

        return getDemappedCols({ path, mapping });
    }
    
    return remapper;
}

module.exports = CSVOnlineSurveyColumnRemapper;
