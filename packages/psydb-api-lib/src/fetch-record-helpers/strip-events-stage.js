'use strict';

var StripEventsStage = ({ subChannels } = {}) => (
    Array.isArray(subChannels)
    ? ({
        $project: subChannels.reduce((acc, sc) => ({
            ...acc,
            [`${sc}.events`]: false,
        }), {})
    })
    : ({ $project: {
        events: false,
    }})
);

module.exports = StripEventsStage;
