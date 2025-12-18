'use strict';
var datefns = require('date-fns');
var { keyBy } = require('@mpieva/psydb-core-utils');
var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');

var augmentEnableFollowUpExperiments = (bag) => {
    var { experimentRecords, studyRecords } = bag;
    
    var studiesById = keyBy({ items: studyRecords, byProp: '_id' });

    for (var it of experimentRecords) {
        var { studyId } = it.state;

        var { enableFollowUpExperiments } = studiesById[studyId].state;
        it._enableFollowUpExperiments = enableFollowUpExperiments;
    }
}

var augmentStudyConsentDocInfo = async (bag) => {
    var { db, experimentRecords } = bag;

    var studyConsentDocs = await aggregateToArray({ db, studyConsentDoc: [
        { $match: {
            'experimentId': { $in: experimentRecords.map(it => it._id) }
        }},
        { $project: {
            '_id': true, 'experimentId': true, 'subjectId': true,
            'state.hasIssues': true
        }}
    ]});

    var studyConsentDocsByKey = keyBy({
        items: studyConsentDocs,
        createKey: (it) => `${it.experimentId}_${it.subjectId}`
    });
    
    for (var er of experimentRecords) {
        var { _id: experimentId, state: { subjectData }} = er;
        for (var sd of subjectData) {
            var { subjectId } = sd;
            var key = `${experimentId}_${subjectId}`;
            var studyConsentDoc = studyConsentDocsByKey[key];

            if (studyConsentDoc) {
                var { _id, state: { hasIssues }} = studyConsentDoc;
                sd._studyConsentDocId = _id;
                sd._studyConsentDocHasIssues = hasIssues;
            }
        }
    }
}

var filterBeforeNoon = (bag) => {
    var { experimentRecords, now } = bag;

    return  experimentRecords.filter(it => {
        var { start } = it.state.interval;
        
        var noonifiedStart = datefns.add(
            datefns.startOfDay(start),
            { hours: 12 }
        );

        return ( noonifiedStart < now )
    })
}

module.exports = {
    augmentEnableFollowUpExperiments,
    augmentStudyConsentDocInfo,
    filterBeforeNoon,
}
