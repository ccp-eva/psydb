'use strict';
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var {
    applyRecordLabels
} = require('@mpieva/psydb-api-lib');

var {
    MatchAlwaysStage,
    StripInternalsStage,
    StripEventsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var fetchResearchGroups = async (context, options) => {
    var { db, permissions } = context;
    var {
        hasRootAccess,
        researchGroupIds: projectedResearchGroupIds
    } = permissions;

    var {
        researchGroupIds,
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
        db.collection('researchGroup').aggregate([
            
            researchGroupIds === undefined
            ? MatchAlwaysStage()
            : (
                { $match: {
                    _id: { $in: researchGroupIds }
                }}
            ),

            hasRootAccess && projectedResearchGroupIds.length < 1
            ? MatchAlwaysStage()
            : (
                { $match: {
                    _id: { $in: (
                        projectedResearchGroupIds
                    )}
                }}
            ),

            StripInternalsStage(),
            StripEventsStage(),
        ]).toArray()
    );

    if (applyLabels) {
        applyRecordLabels({
            records,
            definition: (
                allSchemaCreators.researchGroup.recordLabelDefinition
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

module.exports = fetchResearchGroups;
