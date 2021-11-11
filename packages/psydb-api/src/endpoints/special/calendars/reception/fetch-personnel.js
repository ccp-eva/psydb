'use strict';
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var {
    applyRecordLabels
} = require('@mpieva/psydb-api-lib');

var {
    StripInternalsStage,
    StripEventsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var fetchPersonnel = async (context, options) => {
    var { db } = context;
    var {
        personnelIds,
        onlyLabels = false,
        applyLabels = true,
        fetchRelated = true, // TODO
        gatherDisplayFields = true, // TODO
    } = options;

    if (onlyLabels) {
        applyLabels = true;
        fetchRelated = false;
        gatherDisplayFields = false;
    }

    var records = await (
        db.collection('personnel').aggregate([
            { $match: {
                _id: { $in: personnelIds }
            }},
            StripInternalsStage(),
            StripEventsStage(),
        ]).toArray()
    );

    if (applyLabels) {
        applyRecordLabels({
            records,
            definition: (
                allSchemaCreators.personnel.recordLabelDefinition
            )
        });
    }

    if (onlyLabels) {
        records = records.map(it => ({
            _id: it._id,
            _recordLabel: it._recordLabel,
        }))
    }

    return {
        records
    };
}

module.exports = fetchPersonnel;
