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
    
    '__locationType',
    '__subjectData_comment',
]});

module.exports = onlyRelevantProps;
