'use strict';
var { merge } = require('@mpieva/psydb-core-utils');
var { ExactObject, Id, Timezone } = require('@mpieva/psydb-schema-fields');
var { 
    fetchAllCRTSettings,
    fetchRecordLabelsManual,
    mergeRecordLabelProjections,
    createAllRecordLabels,
    createRecordLabel,
    ResponseBody
} = require('@mpieva/psydb-api-lib');

var { withContext } = require('@mpieva/psydb-api-lib/src/list-endpoint-utils');


var relatedParticipation = async (context, next) => {
    var { db } = context;
    var {
        augmentWithPayload,
        validate,
        verifyPayloadId,
    } = withContext(context);

    augmentWithPayload();

    await validate({ createSchema: Schema });

    await verifyPayloadId({
        collection: 'personnel',
        pointer: '/personnelId',
    });

    var { personnelId, timezone } = context.payload;

    var allCRTSettings = await fetchAllCRTSettings(db, [
        { collection: 'subject' },
        { collection: 'study'}
    ], { wrap: true });

    var subjectLabelProjection = mergeRecordLabelProjections(
        allCRTSettings.subject, { as: '_labelProjection' }
    );

    var path = 'scientific.state.internals.participatedInStudies';
    var records = await db.collection('subject').aggregate([
        { $unwind: '$' + path },
        { $match: {
            [`${path}.experimentOperatorIds`]: personnelId,
            [`${path}.status`]: 'participated',
        }},
        { $project: {
            type: true,
            ...subjectLabelProjection,
            '_participation': '$' + path
        }},
        { $addFields: {
            '_participation.subjectId': '$_id',
            '_participation.subjectType': '$type'
        }},
        { $sort: {
            '_participation.timestamp': 1
        }}
    ], {
        allowDiskUse: true,
        collation: { locale: 'de@collation=phonebook' }
    }).toArray();


    var related = await fetchRecordLabelsManual(db, {
        'study': records.map(it => it._participation.studyId)
    }, { timezone });

    related.subject = createAllRecordLabels({
        collectionCRTSettings: allCRTSettings.subject,
        records,
        from: '_labelProjection',
        timezone
    });


    context.body = ResponseBody({ data: {
        records: records.map(it => it._participation),
        related
    }});

    await next();
}

var Schema = () => {
    return ExactObject({
        properties: {
            personnelId: Id({ collection: 'personnel' }),
            timezone: Timezone(),
        },
        required: [ 'personnelId', 'timezone' ]
    });
}

module.exports = relatedParticipation;
