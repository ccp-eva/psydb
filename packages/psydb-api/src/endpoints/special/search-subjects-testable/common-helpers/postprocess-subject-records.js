'use strict';
var gatherAgeFrameDataOfStudy = require(
    '@mpieva/psydb-api-lib/src/gather-age-frame-data-of-study'
);
var createRecordLabel = require(
    '@mpieva/psydb-api-lib/src/create-record-label'
);

var postprocessSubjectRecords = ({
    i18n,
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
            i18n
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

        record.scientific.state.internals.participatedInStudies = (
            record.scientific.state.internals.participatedInStudies
            .filter(it => (
                it.status === 'participated'
            ))
            .sort((a, b) => (
                a.timestamp.getTime() < b.timestamp.getTime()
                ? 1 : -1
            ))
            .slice(0, 3)
        );
    })

    //console.dir(subjectRecords, { depth: null });

}

module.exports = postprocessSubjectRecords;
