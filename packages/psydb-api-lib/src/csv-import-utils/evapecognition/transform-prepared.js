'use strict';
var { ejson, groupBy, keyBy } = require('@mpieva/psydb-core-utils');
var makeExperiment = require('./make-experiment');
var makeParticipationItems = require('./make-participation-items');

var transformPrepared = (bag) => {
    var {
        pipelineData,
        subjectType, study,
        //location, labOperators,
        timezone
    } = bag;

    var groupedPipelineData = keyBy({
        items: pipelineData,
        createKey: (it) => {
            var { obj } = it;
            var { year, month, day, intradaySeqNumber } = obj;
            return [ year, month, day, intradaySeqNumber ].join('_');
        }
    });

    var transformed = {
        experiments: [],
        participations: [],
    }
    for (var it of Object.values(groupedPipelineData)) {
        var { record, parts } = makeExperiment({
            pipelineItemGroup: [ it ],
            
            subjectType,
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
