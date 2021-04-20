'use strict';

var StripEventsStage = () => (
    { $project: {
        events: false,
    }}
);

module.exports = StripEventsStage;
