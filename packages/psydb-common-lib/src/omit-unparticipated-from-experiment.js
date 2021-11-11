'use strict';
var enums = require('@mpieva/psydb-schema-enums');

var omitFromOne = (experimentRecord) => (
    experimentRecord.state.subjectData
    .filter(it => (
        !enums.unparticipationStatus.keys.includes(
            it.participationStatus
        )
    ))
);

var omitUnparticipatedFromExperiment = ({
    experimentRecord,
    experimentRecords,
}) => {
    if (experimentRecord) {
        experimentRecords = [ experimentRecord ];
    }

    var subjectData = [];
    for (var it of experimentRecords) {
        subjectData.push(...omitFromOne(it))
    }

    return subjectData;
}

module.exports = omitUnparticipatedFromExperiment;
