'use strict';
var makeSubjectContactHistoryItem
    = require('./make-subject-contact-history-item');

var transformPrepared = (bag) => {
    var { pipelineData, subjectType, timezone } = bag;

    var transformed = {
        subjectContactHistory: [],
    }
    for (var it of pipelineData) {
        var { record, parts } = makeSubjectContactHistoryItem({
            pipelineItem: it, subjectType, timezone
        });
        transformed.subjectContactHistory.push({ record, parts });
    }
    return transformed;
}

module.exports = transformPrepared;
