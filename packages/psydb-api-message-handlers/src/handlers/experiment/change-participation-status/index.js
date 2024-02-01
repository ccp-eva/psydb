'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { compareIds } = require('@mpieva/psydb-core-utils');
var { ApiError, createId } = require('@mpieva/psydb-api-lib');
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
        experimentOperatorIds,
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
    var { color, personnelIds } = experimentOperatorTeam.state;

    var unprocessedSubjects = (
        experimentRecord.state.subjectData.filter(it => (
            it.participationStatus === 'unknown'
        ))
    );


    // TODO: for fixating experimentOperatorId
    // we could:
    // a) fixate it on the first processing
    // b) fixate it on the last processing
    // probably a) is the better solution as
    // when we in addition prevent changes in the team when that happened
    // also: we maybe should store the team color as well just in case
    // TODO: we need to set experimentOperatorIds and labTeamColor
    // for the experiments that were already postprocessed
    var shouldFixateExperimentOperatorIds = (
        !experimentOperatorTeamIds?.length
    );
    var shouldSetPostprocessedFlag = (
        // subtract 1 since we are processing one right now
        (unprocessedSubjects.length - 1) === 0
    );

    var experimentId = experimentRecord._id;
    var timestamp = experimentRecord.state.interval.start;

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
                'state.isPostprocessed': true,
                // XXX: we need to migrate data here
                // personnel ids are currently only stored in participation
                'state.experimentOperatorIds': personnelIds,
            }),
            ...(shouldFixateExperimentOperatorIds && {
                'state.labTeamColor': color,
                'state.experimentOperatorIds': personnelIds,
            })
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
                _id: await createId(),

                type: experimentRecord.type,
                experimentId,
                
                studyId: study._id,
                studyType: study.type,
                locationId: location._id,
                locationType: location.type,
                experimentOperatorIds: personnelIds,

                timestamp,
                status: participationStatus,

                excludeFromMoreExperimentsInStudy
            }
        }}
    });
}

module.exports = handler;
