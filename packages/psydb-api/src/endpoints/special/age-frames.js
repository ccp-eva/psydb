'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:ageFrames'
);

var { ObjectId, aggregateToArray } = require('@mpieva/psydb-mongo-adapter');
var { ejson, only, keyBy } = require('@mpieva/psydb-core-utils');
var { __fixRelated } = require('@mpieva/psydb-common-compat');

var {
    ResponseBody,
    validateOrThrow,
    verifyStudyAccess,
    withRetracedErrors,

    fetchAllCRTSettings,
    fetchRelatedLabelsForMany,

    fetchRecordLabelsManual,
    fetchHelperSetItemLabelsManual,
} = require('@mpieva/psydb-api-lib');

var {
    AddLastKnownEventIdStage,
    StripEventsStage,
} = require('@mpieva/psydb-mongo-stages');

var {
    ExactObject,
    ForeignIdList,
    DefaultArray,
    CustomRecordTypeKey
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ExactObject({
    properties: {
        'studyIds': ForeignIdList({ collection: 'study' }),
        'subjectTypes': DefaultArray({
            items: CustomRecordTypeKey({ collection: 'subject' }),
        })
    },
    required: [
        'studyIds',
    ]
})

var ageFrames = async (context, next) => {
    var { 
        db,
        permissions,
        request,
    } = context;
    
    var i18n = only({ from: context, keys: [
        'language', 'locale', 'timezone'
    ]});

    validateOrThrow({
        schema: RequestBodySchema(),
        payload: request.body
    })

    var { studyIds, subjectTypes = undefined } = request.body;

    // FIXME: not sure about this
    var hasOtherPermission = (
        permissions.hasSomeLabOperationFlags({
            types: 'any', flags: [
                'canSearchTestableSubjects',
                'canSelectSubjectsForExperiments'
            ]
        })
    );
    // FIXME: this is incomplete
    // we need to check if the studies
    // research groups match with the users
    if (!hasOtherPermission) {
        await verifyStudyAccess({
            db,
            permissions,
            studyIds,
            action: 'read',
        });
    }

    var ageFrameRecords = await aggregateToArray({ db, ageFrame: [
        { $match: {
            'studyId': { $in: studyIds },
            ...(subjectTypes && {
                'subjectTypeKey': { $in: subjectTypes }
            })
        }}
    ]});

    var allCRTSettings = await fetchAllCRTSettings(db, [
        {
            collection: 'subject',
            recordTypes: ageFrameRecords.map(it => it.subjectTypeKey)
        }
    ], { wrap: true });

    var fieldDefsByPointer = keyBy({
        items: Object.values(allCRTSettings.subject || {}),
        createKey: (it) => it.getType(),
        transform: (it) => (
            keyBy({
                items: it.allCustomFields(),
                byProp: 'pointer'
            })
        )
    });

    var relatedHelperSetItemIds = [];
    var relatedRecordIdsByCollection = [];
    for (var a of ageFrameRecords) {
        var { subjectTypeKey, state: { conditions }} = a;
        for (var c of conditions) {
            var { pointer, values } = c;
            var { systemType, props } = (
                fieldDefsByPointer[subjectTypeKey][pointer]
            );

            if ([
                'ForeignId', 'ForeignIdList'
            ].includes(systemType)) {
                forcePush({
                    into: relatedRecordIdsByCollection,
                    pointer: `/${props.collection}`,
                    values: values.map(ObjectId)
                });
            }
            
            if ([
                'HelperSetItemId', 'HelperSetItemIdList'
            ].includes(systemType)) {
                relatedHelperSetItemIds.push(...values.map(ObjectId))
            }
        }
    };
    
    var relatedRecordLabels = await fetchRecordLabelsManual(db, {
        study: ageFrameRecords.map(it => it.studyId),
        ...relatedRecordIdsByCollection,
    }, { oldWrappedLabels: true, ...i18n });

    var relatedHelperSetItems = await fetchHelperSetItemLabelsManual(db, [
        ...relatedHelperSetItemIds
    ], { oldWrappedLabels: true, ...i18n });

    var __related = {
        relatedRecordLabels,
        relatedHelperSetItems,
    }

    context.body = ResponseBody({
        data: {
            records: ageFrameRecords,
            related: __fixRelated(__related, { isResponse: false }),
            ...(__related),
        },
    });

    await next();
}

module.exports = ageFrames;
