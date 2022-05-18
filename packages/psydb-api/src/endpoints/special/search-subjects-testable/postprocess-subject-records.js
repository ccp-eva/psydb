'use strict';
var gatherAgeFrameDataOfStudy = require(
    '@mpieva/psydb-api-lib/src/gather-age-frame-data-of-study'
);
var createRecordLabel = require(
    '@mpieva/psydb-api-lib/src/create-record-label'
);

var postprocessSubjectRecords = ({
    subjectRecords,
    subjectRecordType,
    studyRecords,
    timeFrame,
    upcomingBySubjectId,
    recordLabelDefinition,
}) => {

    subjectRecords.forEach(record => {
        record._recordLabel = createRecordLabel({
            record: record._recordLabelDefinitionFields,
            definition: recordLabelDefinition,
        });
        delete record._recordLabelDefinitionFields;

        record._upcomingExperiments = (
            upcomingBySubjectId[record._id]
            ? upcomingBySubjectId[record._id].upcoming
            : []
        )

        var testableInStudies = [];
        for (var { _id: studyId } of studyRecords) {
            if (record[`_testableIn_${studyId}`]) {
                testableInStudies.push(studyId);
            }
        }
        record._testableInStudies = testableInStudies;
    })

    //console.dir(subjectRecords, { depth: null });

}

module.exports = postprocessSubjectRecords;
