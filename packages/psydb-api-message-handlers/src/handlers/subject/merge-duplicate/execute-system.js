'use strict';
var { prefixify, only } = require('@mpieva/psydb-core-utils');
var { aggregateToIds } = require('@mpieva/psydb-mongo-adapter');
var {
    withRetracedErrors, mongoEscapeDeep
} = require('@mpieva/psydb-api-lib');
// FIXME
//var { openChannel } = require('../../../lib/generic-record-handler-utils');


var executeSystemEvents = async (context) => {
    var {
        db, rohrpost, message, cache, personnelId,
        dispatch, dispatchProps
    } = context;

    await updateExperiments(context);
    await updateSourceSubject(context);
    await updateTargetSubject(context);

}

var updateExperiments = async (context) => {
    var { db, rohrpost, personnelId, cache } = context;
    var { sourceSubject, targetSubject } = cache.get();

    var update = { $set: {
        'state.selectedSubjectIds.$[i]': targetSubject._id,
        'state.subjectData.$[d].subjectId': targetSubject._id,
    }};
    var arrayFilters = [
        { 'i': sourceSubject._id },
        { 'd.subjectId': sourceSubject._id }
    ]

    //await withRetracedErrors(
    //    db.collection('experiment').updateMany(
    //        { 'state.selectedSubjectIds': sourceSubject._id },
    //        update, { arrayFilters }
    //    )
    //);

    var experimentIds = await aggregateToIds({ db, experiment: {
        'state.selectedSubjectIds': sourceSubject._id,
    }});

    await rohrpost._experimental_dispatchMultiplexed({
        collection: 'experiment',
        channelIds: experimentIds,
        messages: [{
            personnelId,
            payload: mongoEscapeDeep(update),
            arrayFilters: arrayFilters.map(it => (
                mongoEscapeDeep(it, { traverseArrays: true })
            ))
        }],
        mongoExtraOp: { update, arrayFilters }
    });
}

var updateSourceSubject = async (context) => {
    var { db, dispatch, personnelId, cache } = context;
    var { sourceSubject, targetSubject } = cache.get();

    var UPDATE = { $set: prefixify({ values: {
        'isDuplicateOfId': targetSubject._id,
        'isRemoved': true,
        'participatedInStudies': []
    }, prefix: 'scientific.state.internals' }) };

    //await withRetracedErrors(
    //    db.collection('subject').updateOne(
    //        { '_id': sourceSubject._id }, UPDATE
    //    )
    //);

    await dispatch({
        collection: 'subject',
        channelId: sourceSubject._id,
        subChannelKey: 'scientific',
        payload: UPDATE
    });
}

var updateTargetSubject = async (context) => {
    var { db, dispatch, personnelId, cache } = context;
    var { sourceSubject, targetSubject } = cache.get();

    var UPDATE = { $push: prefixify({ values: {
        'mergedDuplicates': only({ from: sourceSubject, keys: [
            '_id', 'sequenceNumber', 'onlineId'
        ]}),
        'participatedInStudies': { $each: (
            sourceSubject.scientific
            .state.internals.participatedInStudies
        )}
    }, prefix: 'scientific.state.internals' }) };

    //await withRetracedErrors(
    //    db.collection('subject').updateOne(
    //        { '_id': targetSubject._id }, UPDATE
    //    )
    //);
    
    await dispatch({
        collection: 'subject',
        channelId: targetSubject._id,
        subChannelKey: 'scientific',
        payload: UPDATE
    });
}

module.exports = { executeSystemEvents }
