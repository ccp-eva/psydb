'use strict';

var customColumnRemap = (col) => {
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

module.exports = customColumnRemap;
