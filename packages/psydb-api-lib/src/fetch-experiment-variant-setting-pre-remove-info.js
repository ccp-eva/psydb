'use strict';
var { hasNone } = require('@mpieva/psydb-core-utils');

var fetchExperimentVariantSettingPreRemoveInfo = async (bag) => {
    var { db, settingId, settingRecord = undefined } = bag;

    if (!settingRecord) {
        settingRecord = await (
            db.collection('experimentVariantSetting').findOne({
                _id: settingId
            })
        );
    }

    var now = new Date(); 
    var { studyId, type, state: { subjectTypeKey }} = settingRecord;
    
    var upcomingExperiments = await (
        db.collection('experiment').aggregate([
            { $match: {
                'type': type,
                'state.studyId': studyId,
                'state.interval.start': { $gte: now },
                'state.isCanceled': false,
                'state.subjectData': { $elemMatch: {
                    subjectType: subjectTypeKey,
                }}
            }},
            { $sort: { 'state.interval.start': 1 }}
        ]).toArray()
    );
    
    var unprocessedExperiments = await (
        db.collection('experiment').aggregate([
            { $match: {
                'type': type,
                'state.studyId': studyId,
                'state.interval.start': { $lte: now },
                'state.isCanceled': false,
                'state.subjectData': { $elemMatch: {
                    participationStatus: 'unknown',
                    subjectType: subjectTypeKey,
                }}
            }},
            { $sort: { 'state.interval.start': 1 }}
        ]).toArray()
    );

    var canRemove = (
        hasNone(upcomingExperiments)
        && hasNone(unprocessedExperiments)
    );

    return {
        canRemove,
        upcomingExperiments,
        unprocessedExperiments,
    }
}

module.exports = { fetchExperimentVariantSettingPreRemoveInfo };
