'use strict';
var { unique } = require('@mpieva/psydb-core-utils');

var gatherSubjectTypesFromLabProcedureSettings = ({ settingRecords }) => {
    var gathered = [];
    for (var setting of settingRecords) {
        var { subjectTypeKey } = setting.state;
        gathered.push(subjectTypeKey);
    }
    return unique(gathered);
}

module.exports = gatherSubjectTypesFromLabProcedureSettings; 
