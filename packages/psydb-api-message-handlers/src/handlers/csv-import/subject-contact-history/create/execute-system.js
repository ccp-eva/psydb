'use strict';
var { createId } = require('@mpieva/psydb-api-lib');


var executeSystemEvents = async (context) => {
    var {
        db, message, cache, personnelId,
        dispatch, dispatchProps
    } = context;

    var { timezone, payload } = message;
    var { subjectType } = payload;

    var { file, pipelineOutput } = cache.get();

    var { pipelineData, transformed } = pipelineOutput;
    var { subjectContactHistory } = transformed;

    var now = new Date();
    var csvImportId = await createId();
    await db.collection('csvImport').insertOne({
        _id: csvImportId,
        type: 'subject-contact-history/default',
        createdBy: personnelId,
        createdAt: now,
        fileId: file._id,
        subjectType,
        pipelineData,
    });

    // FIXME: use dispatch many
    for (var it of subjectContactHistory) {
        var { parts } = it;
        await dispatchProps({
            collection: 'subjectContactHistory',
            channelId: parts._id,
            isNew: true,
            additionalChannelProps: { ...parts.core, csvImportId },
            props: parts.state,
            initialize: false, // NOTE no schema currently
        });
    }

    cache.merge({ csvImportId });
}

module.exports = { executeSystemEvents }
