'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');
var { aggregateOne } = require('@mpieva/psydb-mongo-adapter');

var maybeOverrideNullEnd = async (context) => {
    var { db, message, cache } = context;
    var { props } = message.payload;
    var { study } = cache.get();

    // FIXME: naming is bad, and i dont like the shape of it
    if (await checkIsHiddenChange({ db, study, props })) {
        await toggleRunningPeriodEnd({ db, study, props });
    }
}

var checkIsHiddenChange = async (bag) => {
    var { db, study, props } = bag;
        
    var { systemPermissions: { isHidden }} = props;
    return isHidden !== study.state.systemPermissions.isHidden;
}

var toggleRunningPeriodEnd = async (bag) => {
    var { db, study, props } = bag;
    var { _id: studyId } = study;
    var { systemPermissions: { isHidden }} = props;

    if (isHidden === true) {
        if (props?.runningPeriod?.end === null) {
            // TODO: cant because online dosnt have
            // experiment
            //var last = await withRetracedErrors(
            //    db.collection('experiment').aggregate([
            //        { $match: {
            //            'state.studyId': channelId,
            //            'state.isPostprocessed': true,
            //            'state.isCanceled': false,
            //        }},
            //        { $project: { 'state.interval.end': true }},
            //        { $sort: { 'state.interval.end': -1 }},
            //        { $limit: 1 }
            //    ]).toArray()
            //);
            var last = await aggregateOne({ db, subject: [
                { $unwind: (
                    '$scientific.state.internals.participatedInStudies'
                )},
                { $replaceRoot: { newRoot: (
                    '$scientific.state.internals.participatedInStudies'
                )}},
                { $match: { studyId, status: 'participated' }},
                { $project: { 'timestamp': true }},
                { $sort: { 'timestamp': -1 }},
                { $limit: 1 }
            ]});
            
            var end = last?.timestamp || new Date();
            props.runningPeriod.end = end;
        }
    }
    else {
        jsonpointer.set(props, '/runningPeriod/end', null)
    }
}

module.exports = maybeOverrideNullEnd;
