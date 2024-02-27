'use strict';
var allSchemaCreators = require('@mpieva/psydb-schema-creators');
var { maybeIntersect, compareIds } = require('@mpieva/psydb-core-utils');
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
        researchGroupIds,
        onlyLabels = false,
        applyLabels = true,
        fetchRelated = true, // TODO
        gatherDisplayFields = true, // TODO
    } = options;

    researchGroupIds = maybeIntersect({
        items: permissions.getResearchGroupIds(),
        withMaybe: researchGroupIds,
        compare: compareIds,
    });

    if (onlyLabels) {
        applyLabels = true;
        fetchRelated = false;
        gatherDisplayFields = false;
    }

    var records = await (
        db.collection('researchGroup').aggregate([
            { $match: {
                '_id': { $in: researchGroupIds },
                'state.labMethods': { $in: [ 'inhouse' ]}
            }},
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
