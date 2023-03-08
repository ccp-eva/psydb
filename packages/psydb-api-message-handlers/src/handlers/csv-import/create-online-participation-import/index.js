'use strict';
var debug = require('debug')('psydb:api:message-handlers');
var {
    ApiError,
    createId,
    validateOrThrow,
    parseOnlineParticipationCSV,
    matchOnlineParticipationCSV,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');

var handler = {};

handler.shouldRun = (message) => (
    message.type === 'csv-import/create-online-participation-import'
)

handler.checkSchema = async ({ db, message }) => {
    validateOrThrow({
        schema: Schema(),
        payload: message
    });
} 

handler.checkAllowedAndPlausible = async (context) => {
    var { db, permissions, message, cache } = context;

    if (!permissions.isRoot()) {
        throw new ApiError(403);
    }

    var { fileId, studyId } = message.payload;

    var study = await db.collection('study').findOne({ _id: studyId });
    if (!study) {
        throw new ApiError(409, 'StudyNotFound');
    }

    var file = await db.collection('file').findOne({ _id: fileId });
    if (!file) {
        throw new ApiError(409, 'FileNotFound');
    }
    if (file.mimetype !== 'text/csv') {
        throw new ApiError(409, 'file mime-type is not "text/csv"');
    }

    var parsed = parseOnlineParticipationCSV({
        data: file.blob.toString()
    });

    var matchedData = await matchOnlineParticipationCSV({
        db, parsed, studyId
    });
    var hasErrors = matchedData.find(it => !!it.error);
    if (hasErrors) {
        throw new ApiError(409, 'csv has matching errors');
    }

    cache.study = study;
    cache.file = file;
    cache.matchedData = matchedData;
}

handler.triggerSystemEvents = async (context) => {
    var { db, cache, dispatch, personnelId } = context;
    var { study, file, matchedData } = cache;

    var now = new Date();
    var csvImportId = await createId();
    await db.collection('csvImport').insert({
        _id: csvImportId,
        type: 'onlne-participation',
        createdBy: personnelId,
        createdAt: now,
        fileId: file._id,
        studyId: study._id,
        matchedData,
    });

    for (var it of matchedData) {
        var { subjectId, timestamp } = it;

        var participationItem = {
            _id: await createId(),
            type: 'manual',
            realType: 'online-survey',
            csvImportId,

            studyId: study._id,
            studyType: study.type,

            timestamp,
            status: 'participated',
            excludeFromMoreExperimentsInStudy: false
        };

        await dispatch({
            collection: 'subject',
            channelId: subjectId,
            subChannelKey: 'scientific',
            payload: { $push: {
                'scientific.state.internals.participatedInStudies': (
                    participationItem
                ),
            }}
        });
    }
}

handler.triggerOtherSideEffects = async () => {};

module.exports = handler;
