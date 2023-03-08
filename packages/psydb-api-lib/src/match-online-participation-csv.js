'use strict';
var { compareIds, keyBy } = require('@mpieva/psydb-core-utils');

var matchOnlineParticipationCSV = async (bag) => {
    var { db, parsed, studyId } = bag;
    
    await db.collection('subject').ensureIndex({
        onlineId: 1,
    });
    var subjects = await db.collection('subject').aggregate([
        { $match: {
            onlineId: { $in: parsed.map(it => it.onlineId) }
        }},
        { $project: {
            type: true,
            onlineId: true,
            _participation: (
                '$scientific.state.internals.participatedInStudies'
            )
        }},
    ], {
        allowDiskUse: true,
        collation: { locale: 'de@collation=phonebook' }
    }).toArray();
    
    var subjectsByOnlineId = keyBy({
        items: subjects,
        byProp: 'onlineId'
    });

    var matchedData = [];
    for (var parsedItem of parsed) {
        var { onlineId, timestamp } = parsedItem;
        var subject = subjectsByOnlineId[onlineId];

        var shared = { onlineId, timestamp };
        if (!subject) {
            matchedData.push({ ...shared, error: 'not-found' });
        }
        else {
            var duplicateParticipation = (
                subject._participation.find(it => (
                    it.timestamp.getTime() === timestamp.getTime()
                    && compareIds(it.studyId, studyId)
                ))
            );
            if (duplicateParticipation) {
                matchedData.push({
                    ...shared,
                    subjectId: subject._id,
                    error: 'duplicate-participation'
                });
            }
            else {
                matchedData.push({ ...shared, subjectId: subject._id });
            }
        }
    }

    return matchedData;
}

module.exports = { matchOnlineParticipationCSV }
