'use strict';
var AddLastKnownEventIdStage = ({ subChannels } = {}) => (
    Array.isArray(subChannels)
    ? { $addFields: subChannels.reduce((acc, sc) => ({
        ...acc,
        [`${sc}._lastKnownEventId`]: { $arrayElemAt: [
            `$${sc}.events._id`, 0
        ]},
    }))}
    : { $addFields: {
        '_lastKnownEventId': { $arrayElemAt: [ '$events._id', 0 ]},
    }}
);

module.exports = { AddLastKnownEventIdStage };
