'use strict';
var { ejson, groupBy } = require('@mpieva/psydb-core-utils');
var makeExperiment = require('./make-experiment');
var makeParticipationItems = require('./make-participation-items');

var transformPrepared = (bag) => {
    var {
        pipelineData,
        subjectType, study,
        timezone
    } = bag;

    var transformed = {
        experiments: [],
        participations: [],
    }
    for (var it of pipelineData) {
        var { record, parts } = makeExperiment({
            pipelineItem: it,
            
            subjectType,
            study,
            timezone
        });
        transformed.experiments.push({ record, parts });

        var participationItems = makeParticipationItems({
            experimentParts: parts,
        });
        transformed.participations.push(...participationItems);
    }
    return transformed;
}

module.exports = transformPrepared;
