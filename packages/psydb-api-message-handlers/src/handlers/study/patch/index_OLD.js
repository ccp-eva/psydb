'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');
var { ApiError, withRetracedErrors } = require('@mpieva/psydb-api-lib');
var GenericRecordHandler = require('../../../lib/generic-record-handler');
    
var {
    destructureMessage,
    openChannel,
    createRecordPropMessages,
    dispatchRecordPropMessages,
    maybeUpdateForeignIdTargets
} = require('../../../lib/generic-record-handler-utils');

var handler = GenericRecordHandler({
    collection: 'study',
    op: 'patch',
    
    triggerSystemEvents: async (context) => {
        var { db, rohrpost, message, dispatchProps, dispatch } = context;

        var destructured = destructureMessage({ message });
        var {
            collection,
            recordType,
            id: studyId,
            props,
            //additionalCreateProps
        } = destructured;

        var channel = await openChannel({
            db, rohrpost, ...destructured
        });

        var didIsHiddenChange = await checkIsHiddenChange({
            db, studyId, props
        });
        if (didIsHiddenChange) {
            await toggleRunningPeriodEnd({ db, studyId, props });
        }
        
        await dispatchProps({
            collection,
            channel,
            recordType,
            props,
        });
    }
});

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
            var last = await withRetracedErrors(
                db.collection('subject').aggregate([
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
                ]).toArray()
            );
            
            var end = (
                last.length > 0
                //? last[0].state.interval.end
                ? last[0].timestamp
                : new Date()
            );

            props.runningPeriod.end = end;
        }
    }
    else {
        jsonpointer.set(props, '/runningPeriod/end', null)
    }
}

module.exports = handler;
