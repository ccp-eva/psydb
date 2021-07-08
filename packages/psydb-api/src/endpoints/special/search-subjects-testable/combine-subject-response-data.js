'use strict';
var keyBy = require('@mpieva/psydb-common-lib/src/key-by');

var createRecordLabel = require(
    '@mpieva/psydb-api-lib/src/create-record-label'
);
var fetchRelatedLabelsForMany = require(
    '@mpieva/psydb-api-lib/src/fetch-related-labels-for-many'
);


var combineSubjectResponseData = async ({
    db,

    subjectRecordType,
    subjectRecords,
    subjectRecordsCount,
    subjectAvailableDisplayFieldData,
    subjectDisplayFields,

    studyRecords,
    studyRecordLabelDefinition,
}) => {
    var availableDisplayFieldDataByPointer = keyBy({
        items: subjectAvailableDisplayFieldData,
        byProp: 'dataPointer'
    });

    var displayFieldData = subjectDisplayFields.map(it => ({
        ...availableDisplayFieldDataByPointer[it.dataPointer],
        dataPointer: it.dataPointer,
    }))

    var selectedStudyLabels = studyRecords.map(it => ({
        _id: it._id,
        _recordLabel: createRecordLabel({
            record: it,
            definition: studyRecordLabelDefinition
        })
    }))

    var subjectRelated = await fetchRelatedLabelsForMany({
        db,
        collectionName: 'subject',
        recordType: subjectRecordType,
        records: subjectRecords
    })

    return {
        ...subjectRelated,

        relatedRecordLabels: {
            ...subjectRelated.relatedRecordLabels,
            study: {
                ...subjectRelated.relatedRecordLabels.study,
                ...keyBy({ items: selectedStudyLabels, byProp: '_id' })
            }
        },

        selectedStudyLabels,
        displayFieldData,
        records: subjectRecords,
        count: subjectRecordsCount,
    }
}

module.exports = combineSubjectResponseData;
