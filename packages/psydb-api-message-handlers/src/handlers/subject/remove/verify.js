'use strict';
var { aggregateToArray }
    = require('@mpieva/psydb-mongo-adapter');

var { compose, switchComposition, ApiError }
    = require('@mpieva/psydb-api-lib');
var { composables }
    = require('@mpieva/psydb-api-message-handler-lib');


var compose_verifyAllowedAndPlausible = () => compose([
    verifyGeneralPermissions,
    verifyRecord,
    verifyRecordPermissions,

    verifyNoInvites,
    verifyNoParticipations,
    verifyNoRefs,
]);

var verifyGeneralPermissions = async (context, next) => {
    var { db, permissions, message } = context;
    
    if (!permissions.hasCollectionFlag('subject', 'remove')) {
        throw new ApiError(403);
    }
    
    await next();
}

var verifyRecord = composables.verifyOneRecord({
    collection: 'subject', by: '/payload/_id', cache: true
})

var verifyRecordAccess = composables.verifyRecordAccess({
    collection: 'subject',
    level: 'remove',
    by: ({ cache }) => cache.get('subject'),
})

var verifyNoInvites = async () => (context, next) => {
    var { db, cache, now } = context;
    var { subject } = cache.get();
    
    var { internals } = subject.scientific.state;
    var { invitedForExperiments } = internals;

    if (invitedForExperiments.length > 0) {
        var experiments = await aggregateToArray({ db, experiment: [
            { $match: {
                '_id': { $in: invitedForExperiments.map(it => (
                    it.experimentId
                ))},
                'state.isCanceled': false,
                $or: [
                    { 'state.selectedSubjectIds': subject._id },
                    { 'state.subjectData.subjectId': subject._id },
                ]
            }},
            { $project: {
                '_id': true,
                'type': true,
                'state.interval': true,
            }}
        ]})

        if (experiments.length > 0) {
            throw new ApiError(409, {
                apiStatus: 'SubjectHasExperimentInvitations',
                data: { experiments }
            });
        }
    }

    await next();
}

var verifyNoParticipations = async (context, next) => {
    var { cache } = context;
    var { subject } = cache.get();
    
    var { internals } = subject.scientific.state;
    var { participatedInStudies } = internals;

    if (participatedInStudies.length > 0) {
        var participated = participatedInStudies.filter(it => (
            it.status === 'participated'
        ));
        if (participated.length > 0) {
            throw new ApiError(409, {
                apiStatus: 'SubjectHasStudyParticipation',
                data: { participatedInStudies: participated }
            });
        }
    }
    
    await next();
}

var verifyNoReverseRefs = composables.verifyNoReverseRefs({
    collection: 'subject', by: '/payload/_id',
    excludedRefCollections: [ 'experiment' ], // NOTE: done manually
})
