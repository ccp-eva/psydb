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
        if ([ 'locationId', 'location' ].includes(col)) {
            return 'locationId';
        }
        if (/^experimenter(Ids)?(\[\d+\])?$/.test(col)) {
            var arraySuffix = col.replace(/^experimenter(Ids)?/, '') || '[0]';
            return `experimentOperatorIds${arraySuffix}`;
        }
        if ([ 'subjectId', 'subject' ].includes(col)) {
            return 'subjectData[0].subjectId';
        }
        if (col === 'comment') {
            return 'subjectData[0].comment';
        }
    }

    remapper.ajvpath2csv = remapper.obj2csv = (bag) => {
        var { path } = bag;

        var mapping = {
            date: [{ key: 'date', type: 'scalar' }],
            time: [{ key: 'time', type: 'scalar' }],
            subjectId: [
                { key: 'subjectData', type: 'array' },
                { key: 'subjectId', type: 'scalar' }
            ],
            comment: [
                { key: 'subjectData', type: 'array' },
                { key: 'comment', type: 'scalar' }
            ],
            locationId: [{ key: 'locationId', type: 'scalar' }],
            experimenterIds: [{ key: 'experimentOperatorIds', type: 'array' }]
        }

        return getDemappedCols({ path, mapping });
    }
    
    return remapper;
}

module.exports = CSVManualOnlyParticipationColumnRemapper;
