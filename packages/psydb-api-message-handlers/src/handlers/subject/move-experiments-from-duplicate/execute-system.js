'use strict';
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
            { $set: {
                'scientific.state.internals.participatedInStudies': []
            }}
        )
    );

    await withRetracedErrors(
        db.collection('subject').updateOne(
            { '_id': targetSubject._id },
            { $push: {
                'scientific.state.internals.participatedInStudies': { $each: (
                    sourceSubject.scientific
                    .state.internals.participatedInStudies
                )}
            }}
        )
    );
}

module.exports = { executeSystemEvents }
