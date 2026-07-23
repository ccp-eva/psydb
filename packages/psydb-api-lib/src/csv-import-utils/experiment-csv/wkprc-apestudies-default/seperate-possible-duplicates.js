'use strict';
var { keyBy } = require('@mpieva/psydb-core-utils');
var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');

var addChecksum = (bag) => {
    var { experiments } = bag;

    for (var it of experiments) {
        var { record } = it;

        var __reducedSubjectData = record.state.subjectData.map(it => (
            `${it.subjectId}##${it.role}`
        )).join('##');

        var __joinedLabOperatorIds = (
            record.state.experimentOperatorIds.join('##')
        );

        it.checksum = [
            record.state.interval.start.toISOString(),
            record.state.interval.end.toISOString(),
            record.state.locationId,
            record.state.subjectGroupId,
            record.state.experimentName,
            record.state.conditionName,
            record.state.roomOrEnclosure,
            record.state.totalSubjectCount,

            __reducedSubjectData,
            __joinedLabOperatorIds,
        ].join('##')
    }
}

var seperatePossibleDuplicates = async (bag) => {
    var { db, study, subjectCRT, allTransformed } = bag;
    var { experiments, participations } = allTransformed;

    var todo = { experiments: [], participations: [] };
    var possibleDuplicates = { experiments: [], participations: [] };

    var existing = await aggregateToArray({ db, experiment: {
        'state.studyId': study._id,
    }});

    existing = existing.map(it => ({ record: it }));

    addChecksum({ experiments });
    addChecksum({ experiments: existing });

    existing = keyBy({
        items: existing, byProp: 'checksum'
    });

    var todoExpIds = [];
    for (var it of experiments) {
        var { checksum, record } = it;

        if (existing[checksum]) {
            possibleDuplicates.experiments.push(it);
        }
        else {
            todo.experiments.push(it);
            todoExpIds.push(String(it.record._id));
        }
    }

    for (var it of participations) {
        var [ subjectId, participation ] = it;
        if (todoExpIds.includes(String(participation.experimentId))) {
            todo.participations.push(it);
        }
        else {
            possibleDuplicates.participations.push(it);
        }
    }

    console.log(todo.experiments);
    console.log(possibleDuplicates.experiments);
    return { todo, possibleDuplicates }
}

module.exports = seperatePossibleDuplicates;
