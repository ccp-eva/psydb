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
    recordLabelDefinition,
}) => {

    var gatheredAgeFrameDataByStudyId = {};
    for (var study of studyRecords) {
        var out = gatherAgeFrameDataOfStudy({
            studyRecord: study,
            subjectRecordType,
            timeFrame,
        });
        gatheredAgeFrameDataByStudyId[study._id] = out;
    }

    subjectRecords.forEach(record => {
        record._recordLabel = createRecordLabel({
            record: record._recordLabelDefinitionFields,
            definition: recordLabelDefinition,
        });
        delete record._recordLabelDefinitionFields;

        var testableInStudies = [];
        for (var { _id: studyId } of studyRecords) {
            if (record[`_testableIn_${studyId}`]) {
                // TODO
                /*console.log(record.scientific.state.custom);
                var ageFrameData = gatheredAgeFrameDataByStudyId[studyId]
                for (var it of ageFrameData) {
                    var min = datefns.add(record._ageFrameField, { days: it.ageFrame.start });
                    var max = datefns.add(record._ageFrameField, { days: it.ageFrame.end });

                    console.log(min, max);
                }*/
                testableInStudies.push(studyId);
            }
        }
        record._testableInStudies = testableInStudies;
    })

    console.dir(subjectRecords, { depth: null });

}

module.exports = postprocessSubjectRecords;
