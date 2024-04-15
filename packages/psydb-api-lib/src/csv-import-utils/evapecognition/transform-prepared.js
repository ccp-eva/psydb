'use strict';
var makeExperiment = require('./make-experiment');
var makeParticipationItems = require('./make-participation-items');

var transformPrepared = (bag) => {
    var { preparedObjects, study, location, labOperators, timezone } = bag;

    var transformed = {
        experiments: [],
        participations: [],
    }
    for (var obj of preparedObjects) {
        var { record, parts } = makeExperiment({
            preparedObject: obj,
            
            study,
            location,
            labOperators,
            timezone
        });
        transformed.experiments.push({ record, parts });

        var items = makeParticipationItems({
            experimentParts: parts,
        });
        transformed.participations.push(...items);
    }
    return transformed;
}

module.exports = transformPrepared;
