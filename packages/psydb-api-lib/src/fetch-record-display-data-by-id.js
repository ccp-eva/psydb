'use strict';
var keyBy = require('@mpieva/psydb-common-lib/src/key-by');

var fetchOneCustomRecordType = require('./fetch-one-custom-record-type');
var gatherDisplayFieldsForRecordType = require('./gather-display-fields-for-record-type');
var fetchRelatedLabelsForMany = require('./fetch-related-labels-for-many');
var createRecordLabel = require('./create-record-label');

var {
    StripEventsStage,
    ProjectDisplayFieldsStage,
    SeperateRecordLabelDefinitionFieldsStage,
} = require('./fetch-record-helpers');

var fetchRecordDisplayDataById = async ({
    db,
    collection,
    recordType,
    id,
}) => {
    var recordTypeData = await fetchOneCustomRecordType({
        db,
        collection,
        type: recordType,
    });

    var { recordLabelDefinition } = recordTypeData.state;

    var {
        displayFields,
        availableDisplayFieldData,
    } = await gatherDisplayFieldsForRecordType({
        prefetched: recordTypeData,
    });

    var records = await (
        db.collection(collection).aggregate([
            { $match: {
                _id: id,
                type: recordType,
            }},
            StripEventsStage(),

            SeperateRecordLabelDefinitionFieldsStage({
                recordLabelDefinition,
            }),
            ProjectDisplayFieldsStage({
                displayFields,
                additionalProjection: {
                    'type': true,
                    '_recordLabelDefinitionFields': true,
                }
            }),
        ]).toArray()
    );

    var related = await fetchRelatedLabelsForMany({
        db,
        collectionName: collection,
        recordType,
        records,
    });
    
    var availableDisplayFieldDataByPointer = keyBy({
        items: availableDisplayFieldData,
        byProp: 'dataPointer'
    });

    var displayFieldData = displayFields.map(it => ({
        ...availableDisplayFieldDataByPointer[it.dataPointer],
        dataPointer: it.dataPointer,
    }))

    records.forEach(it => {
        it._recordLabel = createRecordLabel({
            record: it._recordLabelDefinitionFields,
            definition: recordLabelDefinition
        });
        delete it._recordLabelDefinitionFields;
    });

    return ({
        record: records[0],
        ...related,
        displayFieldData,
        recordTypeLabel: recordTypeData.state.label,
    });
}

module.exports = fetchRecordDisplayDataById;
