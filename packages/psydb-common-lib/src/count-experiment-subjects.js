'use strict';
var enums = require('@mpieva/psydb-schema-enums');

var countExperimentSubjects = (options) => {
    var {
        experimentRecord,
        subjectTypeKey,
    } = options;

    var { subjectData } = experimentRecord;
    var count = 0;
    for (var it of subjectData) {
        // FIXME: this might be obsolete wehn we actually remove subjects
        var isUnparticipated = (
            enums.unparticipationStatus.keys.includes(it.participationStatus)
        );
        if (isUnparticipated) {
            continue;
        }
        if (subjectData.type !== subjectTypeKey) {
            continue;
        }

        count += 1
    }
    
    return count;
}

module.exports = countExperimentSubjects;
