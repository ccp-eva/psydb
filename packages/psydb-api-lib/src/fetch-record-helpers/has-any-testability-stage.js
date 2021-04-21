'use strict';
var HasAnyTestabilityStage = ({ studyIds }) => (
    { $match: { $or: (
        studyIds.map(id => ({
            [`_testableIn_${id}`]: true,
        }))
    )}}
);

module.exports = HasAnyTestabilityStage;
