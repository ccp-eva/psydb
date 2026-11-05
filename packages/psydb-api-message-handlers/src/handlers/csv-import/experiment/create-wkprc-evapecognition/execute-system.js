'use strict';
var { createId } = require('@mpieva/psydb-api-lib');


var executeSystemEvents = async (context) => {
    var {
        db, message, cache, personnelId,
        dispatch, dispatchProps
    } = context;

    var { subjectType, skipPossibleDuplicates } = message.payload;

    var { study, file, pipelineOutput } = cache.get();

    var { pipelineData, allTransformed, todo } = pipelineOutput;
    var { experiments, participations } = todo;

    var now = new Date();
    var csvImportId = await createId();
    await db.collection('csvImport').insertOne({
        _id: csvImportId,
        type: 'experiment/wkprc-apestudies-default',
        createdBy: personnelId,
        createdAt: now,
        fileId: file._id,
        studyId: study._id,
        subjectType,
        pipelineData,
        skipPossibleDuplicates,
    });

    for (var it of experiments) {
        var { parts } = it;
        await dispatchProps({
            collection: 'experiment',
            channelId: parts._id,
            isNew: true,
            additionalChannelProps: { ...parts.core, csvImportId },
            props: parts.state,

            initialize: true,
            recordType: parts.core.type,
        });
    }

    for (var it of participations) {
        var [ subjectId, data ] = it;
        //console.log({ subjectId, data });
        await dispatch({
            collection: 'subject',
            channelId: subjectId,
            subChannelKey: 'scientific',
            payload: { $push: {
                'scientific.state.internals.participatedInStudies': {
                    ...data, csvImportId
                },
            }}
        });
    }

    cache.merge({ csvImportId });
}

module.exports = { executeSystemEvents }
