'use strict';
var { merge } = require('@mpieva/psydb-core-utils');
var { ExactObject, Id } = require('@mpieva/psydb-schema-fields');
var { ResponseBody } = require('@mpieva/psydb-api-lib');

var { withContext } = require('@mpieva/psydb-api-lib/src/list-endpoint-utils');


var relatedExperiments = async (context, next) => {
    var {
        augmentWithPayload,
        validate,
        verifyPayloadId,
        SimpleRecordList,
    } = withContext(context);

    augmentWithPayload();

    await validate({
        createSchema: () => merge(
            Schema(),
            SimpleRecordList.createSchema()
        )
    });

    await verifyPayloadId({
        collection: 'subject',
        pointer: '/subjectId',
    });

    var { subjectId, studyId } = context.payload;
    if (studyId) {
        await verifyPayloadId({
            collection: 'subject',
            pointer: '/subjectId',
        });
    }

    var data = await SimpleRecordList.fetchData({
        collection: 'experiment',
        filter: {
            'state.subjectData.subjectId': subjectId,
            ...(studyId && {
                'state.studyId': studyId,
            })
        },
        sort: { 'state.interval.start': 1 }
    });

    context.body = ResponseBody({ data });
    await next();
}

var Schema = () => {
    return ExactObject({
        properties: {
            subjectId: Id({ collection: 'subject' }),
            studyId: Id({ collection: 'study' }),
        },
        required: [ 'subjectId' ]
    });
}

module.exports = relatedExperiments;
