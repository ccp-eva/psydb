'use strict';
var { hasNone } = require('@mpieva/psydb-core-utils');

var fetchExperimentVariantPreRemoveInfo = async (bag) => {
    var { db, variantId, variantRecord = undefined } = bag;

    if (!variantRecord) {
        variantRecord = await (
            db.collection('experimentVariant').findOne({
                _id: variantId
            })
        );
    }

    var now = new Date(); 
    var { studyId, type } = variantRecord;
    
    var upcomingExperiments = await (
        db.collection('experiment').aggregate([
            { $match: {
                'type': type,
                'state.studyId': studyId,
                'state.interval.start': { $gte: now },
                'state.isCanceled': false,
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

module.exports = { fetchExperimentVariantPreRemoveInfo };
