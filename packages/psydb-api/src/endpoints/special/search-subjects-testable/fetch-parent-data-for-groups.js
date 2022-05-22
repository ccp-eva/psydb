'use strict';

var keyBy = require('@mpieva/psydb-common-lib/src/key-by');

var fetchRecordsByFilter = require('@mpieva/psydb-api-lib/src/fetch-records-by-filter');
var gatherDisplayFieldsForRecordType = require('@mpieva/psydb-api-lib/src/gather-display-fields-for-record-type');
var fetchOneCustomRecordType = require('@mpieva/psydb-api-lib/src/fetch-one-custom-record-type');
var fetchRelatedLabelsForMany = require('@mpieva/psydb-api-lib/src/fetch-related-labels-for-many');


var fetchParentDataForGroups = async ({
    db,
    groupByField,
    groupIds,
}) => {
    // FIXME: only if foreign id
    var { collection, recordType } = groupByField.props;

    var {
        displayFields,
        availableDisplayFieldData,
    } = await gatherDisplayFieldsForRecordType({
        db,
        collectionName: collection,
        customRecordType: recordType
    });

    var customRecordTypeData = await fetchOneCustomRecordType({
        db,
        collection: collection,
        type: recordType,
    });

    var recordLabelDefinition = (
        customRecordTypeData.state.recordLabelDefinition
    );

    var records = await fetchRecordsByFilter({
        db,
        collectionName: collection,
        recordType: recordType,
        displayFields,
        recordLabelDefinition,
        additionalPreprocessStages: [
            { $match: {
                _id: { $in: groupIds }
            }}
        ],
        additionalProjection: {
            'state.reservationSettings': true,
            'state.comment': true,
            'state.internals.visits': true,
        },
        disablePermissionCheck: true
    });

    var related = await fetchRelatedLabelsForMany({
        db,
        collectionName: collection,
        recordType: recordType,
        records,
    })

    var availableDisplayFieldDataByPointer = keyBy({
        items: availableDisplayFieldData,
        byProp: 'dataPointer'
    });

    var displayFieldData = displayFields.map(it => ({
        ...availableDisplayFieldDataByPointer[it.dataPointer],
        dataPointer: it.dataPointer,
    }))


    return {
        records,
        displayFieldData,
        ...related,
    }
}

module.exports = fetchParentDataForGroups;
