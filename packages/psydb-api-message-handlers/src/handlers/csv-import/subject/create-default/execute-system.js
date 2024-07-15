'use strict';
var { swapTimezone } = require('@mpieva/psydb-timezone-helpers');
var { createId } = require('@mpieva/psydb-api-lib');
// FIXME
var { openChannel } = require('../../../../lib/generic-record-handler-utils');


var executeSystemEvents = async (context) => {
    var {
        db, rohrpost, message, cache, personnelId,
        dispatch, dispatchProps
    } = context;

    var { timezone } = message;
    var {
        file,
        subjectCRT,
        researchGroup,
        pipelineOutput
    } = cache.get();

    var { matchedData, preparedObjects, transformed } = pipelineOutput;
    var { subjects } = transformed;

    var now = new Date();
    var csvImportId = await createId();
    await db.collection('csvImport').insert({
        _id: csvImportId,
        type: 'subject/default',
        createdBy: personnelId,
        createdAt: now,
        fileId: file._id,
        subjectType: subjectCRT.getType(),
        researchGroupId: researchGroup._id,
        matchedData,
        preparedObjects,
    });

    var collection = 'subject';
    for (var it of subjects) {
        var { parts } = it;

        // FIXME: do this manually, remember seq number chunking
        // and bulk insertion if possible
        var channel = await openChannel({
            db, rohrpost, collection,

            op: 'create',
            recordType: parts.core.type,
            additionalCreateProps: {
                ...parts.core, csvImportId, // TODO: onlineId
            },
            // FIXME: desiredId
            id: parts._id,
        });

        var sharedDispatchBag = {
            collection,
            recordType: parts.core.type,
            channel,
            initialize: true
        }

        await dispatchProps({
            ...sharedDispatchBag,
            subChannelKey: 'gdpr',
            props: parts.gdprState,
        });

        await dispatchProps({
            ...sharedDispatchBag,
            subChannelKey: 'scientific',
            props: parts.scientificState,
        })

        // TODO maybeUpdateForeignIdTargets
    }

    cache.merge({ csvImportId });
}

module.exports = { executeSystemEvents }
