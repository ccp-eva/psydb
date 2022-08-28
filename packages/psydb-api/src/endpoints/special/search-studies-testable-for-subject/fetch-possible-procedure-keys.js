'use strict';

var fetchPossibleProcedureKeys = async (bag) => {
    var { db, studyRecords, subjectType, testingPermissions } = bag;

    var OR = [];
    for (var it of studyRecords) {
        var { _id: studyId, state } = it;
        var { researchGroupIds } = state;
   
        var allowedTypes = (
            testingPermissions
            .intersect({ researchGroupIds })
            .allowedLabOps()
        );

        // FIXME: later we will allow also allow away-team
        allowedTypes = allowedTypes.filter(it => (
            ['inhouse', 'online-video-call'].includes(it)
        ));

        if (allowedTypes.length > 0) {
            OR.push({
                studyId,
                type: { $in: allowedTypes }
            });
        }
    }

    //console.dir({ OR }, { depth: null });
    
    var settings = await (
        db.collection('experimentVariantSetting').aggregate([
            { $match: {
                'state.subjectTypeKey': subjectType,
                $or: OR
            }},
            { $project: {
                'studyId': true,
                'type': true
            }}
        ]).toArray()
    );

    var out = {};
    for (var it of settings) {
        if (!out[it.studyId]) {
            out[it.studyId] = [];
        }
        out[it.studyId].push(it.type);
    }
    return out;
}

module.exports = fetchPossibleProcedureKeys;
