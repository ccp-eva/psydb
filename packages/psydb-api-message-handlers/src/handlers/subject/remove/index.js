'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { unique } = require('@mpieva/psydb-core-utils');

var {
    ApiError,
    compareIds,
    fetchRecordReverseRefs,
} = require('@mpieva/psydb-api-lib');

var SimpleHandler = require('../../../lib/simple-handler');
var checkForeignIdsExist = require('../../../lib/check-foreign-ids-exist');
var PutMaker = require('../../../lib/put-maker');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'subject/remove',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message,
    cache,
}) => {
    if (!permissions.isRoot()) {
        throw new ApiError(403);
    }

    var {
        id,
        lastKnownScientificEventId,
    } = message.payload;

    var record = await (
        db.collection('subject')
        .findOne(
            { _id: id },
            { projection: {
                'scientific.events': false,
                'gdpr.events': false
            }}
        )
    );
    if (!record) {
        throw new ApiError(404);
    }

    var reverseRefs = await fetchRecordReverseRefs({
        db,
        recordId: id
    });

    if (allReverseRefs.length > 1) {
        throw new ApiError(409, {
            apiStatus: 'RecordHasReverseRefs',
            data: { reverseRefs }
        });
    }

    var { scientific: { state }} = record;
    var { internals: {
        invitedForExperiments,
        participatedInStudies
    }} = state;

    console.log({
        invitedForExperiments,
        participatedInStudies
    });

    if (invitedForExperiments.length > 0) {
        var now = new Date();
        var experiments = (
            db.collection('experiment').find(
                { 
                    _id: { $in: invitedForExperiments.map(it => (
                        it.experimentId
                    ))},
                    'state.isPostprocessed': false,
                    'state.isCanceled': false
                },
                {
                    _id: true,
                    type: true,
                    'state.interval': true,
                }
            ).toArray()
        );

        throw new ApiError(409, {
            apiStatus: 'SubjectHasExperimentInvitations',
            data: { experiments }
        });
    }

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

    console.log(state);
    
}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    personnelId,
    cache,
}) => {
}


module.exports = handler;
