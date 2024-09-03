'use strict';
var { getDemappedCols } = require('../utils');

var CSVWKPRCApestudiesDefaultColumnRemapper = (bag) => {
    var remapper = {};

    remapper.csv2obj = (bag) => {
        var { colkey: col } = bag;

        if (col === 'experiment_name') {
            return 'experimentName';
        }
        if (col === 'daily_running_No') {
            return 'intradaySeqNumber';
        }
        if (col === 'year') {
            return 'year';
        }
        if (col === 'month') {
            return 'month';
        }
        if (col === 'day') {
            return 'day';
        }
        if (col === 'location') {
            return 'locationId';
        }
        if (col === 'room_enclosure') {
            return 'roomOrEnclosure';
        }
        if (col === 'experimenter_id') {
            return 'experimentOperatorIds[0]';
        }
        if (/^subject/.test(col)) {
            var [ _unused, ix = 0 ] = col.split('_');
            return `subjectData[${ix}].subjectId`;
        }
        if (/^role/.test(col)) {
            var [ _unused, ix = 0 ] = col.split('_');
            return `subjectData[${ix}].role`;
        }
        if (/^comment/.test(col)) {
            var [ _unused, ix = 0 ] = col.split('_');
            return `subjectData[${ix}].comment`;
        }
        if (col === 'trial_participants') {
            return 'totalSubjectCount';
        }
    }

    remapper.obj2csv = (bag) => {
        var { path } = bag;

        var mapping = {
            year: [{ key: 'year', type: 'scalar' }],
            month: [{ key: 'month', type: 'scalar' }],
            day: [{ key: 'day', type: 'scalar' }],

            subject: [
                { key: 'subjectData', type: 'array' },
                { key: 'subjectId', type: 'scalar' }
            ],
            role: [
                { key: 'subjectData', type: 'array' },
                { key: 'role', type: 'scalar' }
            ],
            comment: [
                { key: 'subjectData', type: 'array' },
                { key: 'comment', type: 'scalar' }
            ],

            experiment_name: [{ key: 'experimentName', type: 'scalar' }],
            room_enclosure: [{ key: 'roomOrEnclosure', type: 'scalar' }],
            daily_running_No: [{ key: 'intradaySeqNumber', type: 'scalar' }],
            location: [{ key: 'locationId', type: 'scalar' }],
            trial_participants: [
                { key: 'totalSubjectCount', type: 'scalar' }
            ],
            experimenter_id: [
                { key: 'experimentOperatorIds', type: 'array' }
            ],
        }

        return getDemappedCols({ path, mapping });
    }

    return remapper;
}

module.exports = CSVWKPRCApestudiesDefaultColumnRemapper;
