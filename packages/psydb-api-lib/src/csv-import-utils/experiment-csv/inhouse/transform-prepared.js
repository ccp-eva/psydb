'use strict';
var { ejson, groupBy } = require('@mpieva/psydb-core-utils');
var makeExperiment = require('./make-experiment');
var makeParticipationItems = require('./make-participation-items');

var default_groupingFN = (bag) => {
    var { pipelineData } = bag;
    
    var groupedPipelineData = groupBy({
        items: pipelineData,
        createKey: (it) => {
            var { obj } = it;
            var { date, time } = obj;
            return [ date, time ].join('T');
        }
    });

    return groupedPipelineData;
}

var transformPrepared = (bag) => {
    var {
        pipelineData,
        subjectCRT, study,
        //location, labOperators,
        timezone,

        groupingFN = default_groupingFN
    } = bag;

    var groupedPipelineData = groupingFN({ pipelineData });

    var transformed = {
        experiments: [],
        participations: [],
    }
    for (var it of Object.values(groupedPipelineData)) {
        var { record, parts } = makeExperiment({
            pipelineItemGroup: it,
            
            subjectType: subjectCRT.getType(),
            study,
            //location,
            //labOperators,
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
