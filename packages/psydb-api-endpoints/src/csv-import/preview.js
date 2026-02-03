'use strict';
var { merge, keyBy } = require('@mpieva/psydb-core-utils');
var { ExactObject, Id, Timezone } = require('@mpieva/psydb-schema-fields');
var { 
    parseOnlineParticipationCSV,
    matchOnlineParticipationCSV,
    fetchRecordLabelsManual,
    ResponseBody,
    ApiError,
} = require('@mpieva/psydb-api-lib');

var { withContext } = require('@mpieva/psydb-api-lib/src/list-endpoint-utils');

var previewCSVImport = async (context, next) => {
    var { db, permissions } = context;
    
    if (!permissions.isRoot()) {
        throw new ApiError(403);
    }

    var {
        augmentWithPayload,
        validate,
        verifyPayloadId,
    } = withContext(context);

    augmentWithPayload();

    await validate({ createSchema: Schema });
    await verifyPayloadId({ collection: 'file', pointer: '/fileId' });
    await verifyPayloadId({ collection: 'study', pointer: '/studyId' });

    var { fileId, studyId, timezone } = context.payload;

    var file = await db.collection('file').findOne({
        _id: fileId
    });

    if (file.mimetype !== 'text/csv') {
        throw new ApiError(409, 'file mime-type is not "text/csv"');
    }

    var parsed = parseOnlineParticipationCSV({
        data: file.blob.toString()
    });

    var matchedData = await matchOnlineParticipationCSV({
        db, parsed, studyId
    });

    var related = await fetchRecordLabelsManual(db, {
        'subject': matchedData.map(it => it.subjectId)
    }, { timezone });

    context.body = ResponseBody({ data: {
        previewData: matchedData,
        related
    }});

    await next();
}

var Schema = () => {
    return ExactObject({
        properties: {
            fileId: Id({ collection: 'file' }),
            studyId: Id({ collection: 'study' }),
            timezone: Timezone(),
        },
        required: [ 'fileId', 'timezone' ]
    });
}

module.exports = previewCSVImport;
