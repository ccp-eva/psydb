'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { nanoid } = require('nanoid');
var { ApiError, compareIds } = require('@mpieva/psydb-api-lib');
var { SimpleHandler } = require('../../../lib/');
var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment/change-participation-status',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    cache,
    message
}) => {
    // TODO
    if (!permissions.hasRootAccess) {
        //throw new ApiError(403);
    }

    var {
        experimentId,
        subjectId,
        participationStatus,
    } = message.payload;

    var experimentRecord = cache.experimentRecord = await (
        db.collection('experiment').findOne({
            _id: experimentId
        })
    );

    if (!experimentRecord) {
        throw new ApiError(400, 'InvalidExperimentId');
    }

    var subjectRecord = cache.subjectRecord = await (
        db.collection('subject').findOne({
            _id: subjectId
        })
    )

    if (!subjectRecord) {
        throw new ApiError(400, 'InvalidSubjectId');
    }
    
    var subjectDataIndex = (
        experimentRecord.state.subjectData.findIndex(it => {
            return compareIds(it.subjectId, subjectId)
            && it.participationStatus === 'unknown'
        })
    );
    if (subjectDataIndex === undefined) {
        throw new ApiError(400, 'InvalidSubjectId');
    }

}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    cache,
    message,
    dispatch,
}) => {
    var { type: messageType, payload } = message;
    var {
        experimentId,
        subjectId,
        participationStatus,
        excludeFromMoreExperimentsInStudy = false
    } = payload;

    var {
        experimentRecord,
        subjectRecord,
    } = cache;

    var {
        studyId,
        locationId,
        experimentOperatorTeamId,
    } = experimentRecord.state;

    var study = await (
        db.collection('study').findOne({ _id: studyId })
    );
    var location = await (
        db.collection('location').findOne({ _id: locationId })
    );
    var experimentOperatorTeam = await (
        db.collection('experimentOperatorTeam')
        .findOne({ _id: experimentOperatorTeamId })
    );
    var { personnelIds } = experimentOperatorTeam.state;

    var unprocessedSubjects = (
        experimentRecord.state.subjectData.filter(it => (
            it.participationStatus === 'unknown'
        ))
    )
    var shouldSetPostprocessedFlag = (
        // subtract 1 since we are processing one right now
        (unprocessedSubjects.length - 1) === 0
    )

    var eix = experimentRecord.state.subjectData.findIndex(it => {
        return compareIds(it.subjectId, subjectId)
    });
    var epath = `state.subjectData.${eix}`;
    await dispatch({
        collection: 'experiment',
        channelId: experimentId,
        payload: { $set: {
            [`${epath}.participationStatus`]: participationStatus,
            // FIXME: not in schema, not set by default
            ...(excludeFromMoreExperimentsInStudy && {
                [`${epath}.excludeFromMoreExperimentsInStudy`]: true
            }),
            ...(shouldSetPostprocessedFlag && {
                'state.isPostprocessed': true
            }),
        }}
    });

    var spath = `scientific.state.internals.participatedInStudies`;
    // TODO: we need to somehow mark the invitation in subject
    // record to not be pending anymore
    // => this required extra filter in addition to chennel id
    // mongodb.update(
    // { _id: subjectId, invitations: { $elemMatch: { experimentId }} }
    // { 'invitations.$.status': 'processed' }
    // )
    await dispatch({
        collection: 'subject',
        channelId: subjectId,
        subChannelKey: 'scientific',
        payload: { $push: {
            [spath]: {
                _id: nanoid(),

                type: experimentRecord.type,
                experimentId: experimentRecord._id,
                
                studyId: study._id,
                studyType: study.type,
                locationId: location._id,
                locationType: location.type,
                experimentOperatorIds: personnelIds,

                timestamp: experimentRecord.state.interval.start,
                status: participationStatus,

                excludeFromMoreExperimentsInStudy
            }
        }}
    });
}

module.exports = handler;
