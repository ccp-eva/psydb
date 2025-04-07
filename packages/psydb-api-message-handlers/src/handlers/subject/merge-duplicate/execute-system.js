'use strict';
var { prefixify, only } = require('@mpieva/psydb-core-utils');
var { withRetracedErrors } = require('@mpieva/psydb-api-lib');
// FIXME
//var { openChannel } = require('../../../lib/generic-record-handler-utils');


var executeSystemEvents = async (context) => {
    var {
        db, rohrpost, message, cache, personnelId,
        dispatch, dispatchProps
    } = context;

    var { sourceSubject, targetSubject } = cache.get();

    await withRetracedErrors(
        db.collection('experiment').updateMany(
            { 'state.selectedSubjectIds': sourceSubject._id },
            { $set: {
                'state.selectedSubjectIds.$[i]': targetSubject._id,
                'state.subjectData.$[d].subjectId': targetSubject._id,
            }},
            { arrayFilters: [
                { 'i': sourceSubject._id },
                { 'd.subjectId': sourceSubject._id }
            ]}
        )
    );

    await withRetracedErrors(
        db.collection('subject').updateOne(
            { '_id': sourceSubject._id },
            { $set: prefixify({ values: {
                'isDuplicateOfId': targetSubject._id,
                'isRemoved': true,
                'participatedInStudies': []
            }, prefix: 'scientific.state.internals' }) },
        )
    );

    await withRetracedErrors(
        db.collection('subject').updateOne(
            { '_id': targetSubject._id },
            { $push: prefixify({ values: {
                'mergedDuplicates': only({ from: sourceSubject, keys: [
                    '_id', 'sequenceNumber', 'onlineId'
                ]}),
                'participatedInStudies': { $each: (
                    sourceSubject.scientific
                    .state.internals.participatedInStudies
                )}
            }, prefix: 'scientific.state.internals' }) },
        )
    );
}

module.exports = { executeSystemEvents }
