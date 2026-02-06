'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');

var MatchAgeFrameOverlapStage = (bag) => {
    var { ageFrame } = bag;
    var { start, end } = ageFrame;
    var path = 'state.interval';

    var stage = { $match: { $or: [
        AgeFrameIncludesEdge({ path, edge: start }),
        AgeFrameIncludesEdge({ path, edge: end }),
        AgeFrameWithinOurs({ path, ageFrame })
    ]}};

    return stage;
}

var AgeFrameWithinOurs = (bag) => {
    var { path, ageFrame } = bag;
    var { start, end } = ageFrame;

    return {
        [`${path}.start.years`]: { $gte: start.years },
        [`${path}.start.months`]: { $gte: start.months },
        [`${path}.start.days`]: { $gte: start.days },

        [`${path}.end.years`]: { $lte: end.years },
        [`${path}.end.months`]: { $lte: end.months },
        [`${path}.end.days`]: { $lte: end.days },
    };
}

var AgeFrameIncludesEdge = (bag) => {
    var { path, edge } = bag;
    var { years, months, days } = edge;
    
    return {
        [`${path}.start.years`]: { $lte: years },
        [`${path}.start.months`]: { $lte: months },
        [`${path}.start.days`]: { $lte: days },
        
        [`${path}.end.years`]: { $gte: years },
        [`${path}.end.months`]: { $gte: months },
        [`${path}.end.days`]: { $gte: days },
    }
}

module.exports = MatchAgeFrameOverlapStage;
