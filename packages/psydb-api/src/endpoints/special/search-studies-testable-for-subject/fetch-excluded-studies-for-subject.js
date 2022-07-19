'use strict';
var { unique, keyBy, compareIds } = require('@mpieva/psydb-core-utils');

var fetchExcludedStudiesForSubject = async (bag) => {
    var { db, subjectRecord } = bag;

    var {
        invitedForExperiments,
        participatedInStudies,
    } = subjectRecord.scientific.state.internals;

    var subjectStudies = await (
        db.collection('study').aggregate([
            { $match: {
                _id: { $in: [
                    ...invitedForExperiments.map(it => it.studyId),
                    ...participatedInStudies.map(it => it.studyId)
                ]}
            }},
            { $project: {
                'state.excludedOtherStudyIds': true,
                'state.enableFollowUpExperiments': true,
            }}
        ]).toArray()
    );

    var subjectStudiesById = keyBy({
        items: subjectStudies,
        byProp: '_id'
    });

    var exclusion = [];
    for (var it of subjectStudies) {
        for (var exId of it.state.excludedOtherStudyIds) {
            var existing = (
                exclusion
                .find(a => compareIds(a.studyId === exId))
            );
            if (!existing) {
                exclusion.push({
                    type: 'excluded',
                    studyId: exId,
                    source: 'study-constraint',
                    sourceId: it._id
                })
            }
        }
    }

    for (var it of participatedInStudies) {
        if (it.status !== 'participated') {
            continue;
        }

        var existing = (
            exclusion
            .find(a => compareIds(a.studyId === it.studyId))
        );
        if (existing.type === 'excluded') {
            continue;
        }

        var study = subjectStudiesById[it.studyId];
        if (study.state.enableFollowUpExperiments) {
            if (!existing) { // FIXME: only with 2 types possible
                if (it.excludeFromMoreExperimentsInStudy) {
                    exclusion.push({
                        type: 'excluded',
                        studyId: it.studyId,
                        source: 'subject-experiment'
                    });
                }
                else {
                    exclusion.push({
                        type: 'only-followup',
                        studyId: it.studyId,
                        source: 'subject-experiment'
                    });
                }
            }
        }
        else {
            exclusion.push({
                type: 'excluded',
                studyId: it.studyId,
                source: 'subject-experiment'
            });
        }
    }
    for (var it of invitedForExperiments) {
        var existing = (
            exclusion
            .find(a => compareIds(a.studyId === it.studyId))
        );
        if (existing && existing.type === 'excluded') {
            continue;
        }

        var study = subjectStudiesById[it.studyId];
        if (study.state.enableFollowUpExperiments) {
            if (!existing) { // FIXME: only with 2 types possible
                exclusion.push({
                    type: 'only-followup',
                    studyId: it.studyId,
                    source: 'subject-experiment'
                });
            }
        }
        else {
            exclusion.push({
                type: 'excluded',
                studyId: it.studyId,
                source: 'subject-experiment'
            });
        }
    }

    return exclusion
}

module.exports = fetchExcludedStudiesForSubject;
