'use strict';
var { only } = require('@mpieva/psydb-core-utils');

var onlyRelevantProps = ({ from }) => only({ from, keys: [
    'experimentName',
    'conditionName',
    'year',
    'month',
    'day',
    'locationId',
    'roomOrEnclosure',
    'experimentOperatorIds',
    'subjectData',
    'totalSubjectCount',
    'subjectGroupId',
]});

module.exports = onlyRelevantProps;
