'use strict';
var { keyBy } = require('@mpieva/psydb-core-utils');
var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');

var fetchStudyConsentDocsBySubject = async (options) => {
    var { db, experimentData } = options;

    var { studyId, subjectData } = experimentData.record.state;
    var studyConsentDocs = await aggregateToArray({ db, studyConsentDoc: [
        { $match: {
            'studyId': studyId,
            'subjectId': { $in: subjectData.map(it => it.subjectId) }
        }},
        { $project: { '_id': true, 'studyId': true, 'subjectId': true }}
    ]});

    var studyConsentDocsBySubject = keyBy({
        items: studyConsentDocs,
        byProp: 'subjectId'
    });

    return studyConsentDocsBySubject;
}

module.exports = fetchStudyConsentDocsBySubject;
