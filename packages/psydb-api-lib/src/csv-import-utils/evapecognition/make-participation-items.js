'use strict';
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');

var makeParticipationItems = (bag) => {
    var { experimentParts } = bag;
    var {
        studyId,
        studyRecordType,
        interval,
        subjectData,
        timezone,
    } = experimentParts.state;


    var out = [];
    for (var it of subjectData) {
        var { subjectId, comment } = it;
        var participationItem = {
            _id: ObjectId(),
            experimentId: experimentParts._id,
            ...experimentParts.core,

            studyId,
            studyType: studyRecordType,
            timestamp: interval.start,
            timezone,
            
            status: 'participated',
            excludeFromMoreExperimentsInStudy: false,
        };

        out.push([ it.subjectId, participationItem ]);
    }

    return out;
}

module.exports = makeParticipationItems;
