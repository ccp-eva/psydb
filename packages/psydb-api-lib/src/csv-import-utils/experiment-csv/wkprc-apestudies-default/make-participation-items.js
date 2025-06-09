'use strict';
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');

var makeParticipationItems = (bag) => {
    var { experimentParts } = bag;
    var {
        studyId,
        studyRecordType,
        interval,
        subjectData,
        locationId,
        locationRecordType,

        experimentName,
        roomOrEnclosure,
        totalSubjectCount,

        timezone,
    } = experimentParts.state;


    var out = [];
    for (var it of subjectData) {
        var { subjectId, comment, role } = it;
        var participationItem = {
            _id: ObjectId(),
            experimentId: experimentParts._id,
            ...experimentParts.core,

            studyId,
            studyType: studyRecordType,
            locationId,
            locationType: locationRecordType,
            timestamp: interval.start,
            timezone, // FIXME: ????
            
            experimentName,
            roomOrEnclosure,
            totalSubjectCount,
            role,

            status: 'participated',
            excludeFromMoreExperimentsInStudy: false,
        };

        out.push([ it.subjectId, participationItem ]);
    }

    return out;
}

module.exports = makeParticipationItems;
