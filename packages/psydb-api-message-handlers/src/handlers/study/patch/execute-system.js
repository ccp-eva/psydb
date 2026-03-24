'use strict';
var { jsonpointer, pathify, merge, seperateNulls }
    = require('@mpieva/psydb-core-utils');
var { aggregateOne} = require('@mpieva/psydb-mongo-adapter');

var executeSystemEvents = async (context) => {
    var { message, dispatch } = context;
    var { _id: studyId, props } = message.payload;

    if (await checkIsHiddenChange({ db, studyId, props })) {
        await toggleRunningPeriodEnd({ db, studyId, props });
    }

    var pathified = merge(
        //createDefaults(Study.State()), // TODO
        pathify(props, { prefix: 'state' }),
    );
    // NOTE: mongodb does not allow nested $set path on values that are null
    // i.e. 'state.foo' = null and { $set: 'state.foo.a': 42 }
    var { values: SET } = seperateNulls({ from: pathified });

    await dispatch({
        collection: 'study',
        channelId: studyId,
        payload: { $set: SET }
    });
}

var checkIsHiddenChange = async (bag) => {
    var { db, studyId, props } = bag;
        
    var { systemPermissions: { isHidden }} = props;
    var currentRecord = await withRetracedErrors(
        db.collection('study').findOne({ _id: studyId })
    );
    
    return isHidden !== currentRecord.state.systemPermissions.isHidden;
}

var toggleRunningPeriodEnd = async (bag) => {
    var { db, studyId, props } = bag;
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

module.exports = { executeSystemEvents }
