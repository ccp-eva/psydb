'use strict';
var { getDemappedCols } = require('../utils');

var CSVManualOnlyParticipationColumnRemapper = (bag) => {
    var remapper = {};
    
    remapper.csv2obj = (bag) => {
        var { colkey: col } = bag;
        
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

    remapper.obj2csv = (bag) => {
        var { path } = bag;

        var mapping = {
            date: [{ key: 'date', type: 'scalar' }],
            time: [{ key: 'time', type: 'scalar' }],
            subject: [
                { key: 'subjectData', type: 'array' },
                { key: 'subjectId', type: 'scalar' }
            ],
            comment: [
                { key: 'subjectData', type: 'array' },
                { key: 'comment', type: 'scalar' }
            ],
            location: [{ key: 'locationId', type: 'scalar' }],
            experimenter: [{ key: 'experimentOperatorIds', type: 'array' }]
        }

        return getDemappedCols({ path, mapping });
    }
    
    return remapper;
}

module.exports = CSVManualOnlyParticipationColumnRemapper;
