'use strict';
// XXX: OBSOLETE
var {
    keyBy,
} = require('@mpieva/psydb-core-utils');

var {
    fetchOneCustomRecordType,
    gatherDisplayFieldsForRecordType,
    fetchRelatedLabelsForMany,
    applyRecordLabels,
} = require('@mpieva/psydb-api-lib');

var {
    ProjectDisplayFieldsStage,
    StripEventsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');


var fetchSubjectsOfType = async (context, options) => {
    var { db, permissions } = context;
    var {
        subjectTypeKey,
        subjectIds,
        fetchRelated = true,
        applyLabels = true,
        gatherDisplayFields = true,
    } = options;

    var subjectTypeRecord = await fetchOneCustomRecordType({
        db,
        collection: 'subject',
        type: subjectTypeKey,
    });

    var displayFieldData;
    if (gatherDisplayFields) {
        var {
            displayFields,
            availableDisplayFieldData,
        } = await gatherDisplayFieldsForRecordType({
            prefetched: subjectTypeRecord,
            permissions
        });
        

        // FIXME: i think this might be obsolete since we
        // have pointers already in the fields definitions
        var availableDisplayFieldDataByPointer = keyBy({
            items: availableDisplayFieldData,
            byProp: 'dataPointer'
        });

        // FIXME: i think this might be obsolete since we
        // have pointers already in the fields definitions
        var displayFieldData = displayFields.map(it => ({
            ...availableDisplayFieldDataByPointer[it.dataPointer],
            dataPointer: it.dataPointer,
        }))
    }

    var records = await (
        db.collection('subject').aggregate([
            { $match: {
                _id: { $in: subjectIds }
            }},
            StripEventsStage({ subChannels: ['gdpr', 'scientific' ]}),

            ProjectDisplayFieldsStage({
                displayFields,
                additionalProjection: {
                    type: true,
                }
            }),
        ]).toArray()
    );

    var related;
    if (fetchRelated) {
        related = await fetchRelatedLabelsForMany({
            db,
            collectionName: 'subject',
            recordType: subjectTypeKey,
            records
        })
    }

    if (applyLabels) {
        applyRecordLabels({
            records,
            customRecordType: subjectTypeRecord,
        });
    }

    return {
        records,
        related,
        displayFieldData,
    }
}

module.exports = fetchSubjectsOfType;
