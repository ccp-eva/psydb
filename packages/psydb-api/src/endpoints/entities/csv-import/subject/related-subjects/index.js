'use strict';
var { keyBy, only, merge, uniquePush } = require('@mpieva/psydb-core-utils');
var { CRTSettings } = require('@mpieva/psydb-common-lib');
var { ExactObject, Id } = require('@mpieva/psydb-schema-fields');
var {
    withRetracedErrors,
    aggregateToArray,
    ResponseBody
} = require('@mpieva/psydb-api-lib');

var { withContext } = require('@mpieva/psydb-api-lib/src/list-endpoint-utils');


var relatedExperiments = async (context, next) => {
    var { db, permissions } = context;
    
    var i18n = only({ from: context, keys: [
        'language', 'locale', 'timezone'
    ]});

   
    // TODO
    if (!permissions.isRoot()) {
        throw new ApiError(403);
    }

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
        collection: 'csvImport',
        pointer: '/csvImportId',
    });

    var { csvImportId } = context.payload;

    var data = await SimpleRecordList.fetchData({
        collection: 'subject',
        filter: {
            csvImportId
        },
        sort: { 'sequenceNumber': 1 },
        collation: {
            locale: 'de@collation=phonebook',
            numericOrdering: true
        },
        fetchRelated: false
    });

    var subjectTypes = [];
    for (var it of data.records) {
        uniquePush({ into: subjectTypes, values: [ it.type ] }) 
    }

    var subjectCRTRecords = await withRetracedErrors(
        aggregateToArray({ db, customRecordType: [
            { $match: {
                type: { $in: subjectTypes }
            }}
        ]})
    );

    var subjectCRTs = keyBy({
        items: subjectCRTRecords,
        byProp: 'type',
        transform: it => CRTSettings.fromRecord(it)
    });

    var transformedRecords = [];
    for (var it of data.records) {
        var { type } = it;
        
        var pass = only({
            from: it,
            keys: [ '_id', 'sequenceNumber', 'type' ]
        });

        var _recordLabel = subjectCRTs[type].getLabelForRecord({
            record: it, ...i18n
        });
        transformedRecords.push({ ...pass, _recordLabel });
    }

    context.body = ResponseBody({ data: { records: transformedRecords }});
    await next();
}

var Schema = () => {
    return ExactObject({
        properties: {
            csvImportId: Id({ collection: 'csvImport' }),
        },
        required: [ 'csvImportId' ]
    });
}

module.exports = relatedExperiments;
