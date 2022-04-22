'use strict';
var jsonpointer = require('jsonpointer');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var {
    arrify,
    merge,
    unique,
    convertSchemaPointerToMongoPath,
    queryObject,
} = require('@mpieva/psydb-core-utils');

var {
    ExactObject,
    Id,
    StringEnum,
    Integer
} = require('@mpieva/psydb-schema-fields');

var {
    ApiError,
    ResponseBody,
    validateOrThrow,
    resolvePossibleRefs,
} = require('@mpieva/psydb-api-lib');



var relatedExperiments = async (context, next) => {
    augmentWithPayload(context);

    // validate post params
    await validate(context)({
        createSchema: Schema
    });

    // check if team exists
    await verifyPayloadId(context)({
        collection: 'experimentOperatorTeam',
        pointer: '/teamId',
    });

    //await verifyPermissions(context)({
    //    collection: 'experimentOperatorTeam',
    //    id: teamId,
    //});

    // find and create listing of experiment records
    var { teamId } = context.payload;
    var data = await fetchSimpleRecordList(context)({
        collection: 'experiment',
        filter: { 'state.experimentOperatorTeamId': teamId },
    })
    context.body = ResponseBody({ data });

    await next();
}

var Schema = () => {
    return merge(
        ExactObject({
            properties: {
                teamId: Id({ collection: 'experimentOperatorTeam' }),
            },
            required: [ 'teamId' ]
        }),
        SimpleRecordListSchema()
    );
}

var SimpleRecordListSchema = () => {
    return ExactObject({
        properties: {
            out: StringEnum([ 'count', 'id-only', 'full' ]),
            limit: Integer({ minimum: 0 }),
            offset: Integer({ minimum: 1 }),
        },
        required: [ 'out' ]
    })
}

var augmentWithPayload = (context, type) => {
    var pointer = (
        type === 'get'
        ? '/params'
        : '/request/body'
    );
    context.payload = jsonpointer.get(context, pointer);
}

var validate = (context) => async (options) => {
    var { payload } = context;
    var { createSchema } = options;

    validateOrThrow({
        schema: createSchema(),
        payload
    });
}

var verifyPayloadId = (context) => async (options) => {
    var { db, payload } = context;
    var { collection, pointer } = options;
    
    var id = jsonpointer.get(payload, pointer);

    var doc = await (
        db.collection(collection)
        .findOne({ _id: id }, { projection: { _id: true }})
    );
    if (!doc) {
        throw new ApiError(400, {
            apiStatus: 'InvalidPayloadId',
            // FIXME: fake ajv error
            data: { collection, pointer, id }
        });
    }
}

var fetchSimpleRecordList = (context) => async (options) => {
    var { db, payload } = context;

    var { out, limit, offset } = payload;
    var { collection, filter } = options;

    var stages = [
        filter && { $match: filter },
        out === 'id-only' && { $project: { _id: true }},
        offset && { $skip: offset },
        limit && { $limit: limit },
        out === 'count' && { $count: 'COUNT' }
    ].filter(it => !!it);

    var docs = await db.collection(collection).aggregate(
        stages,
        {
            allowDiskUse: true,
            collation: { locale: 'de@collation=phonebook' }
        }
    ).toArray();

    if (out === 'count') {
        return { count: docs[0].COUNT }
    }
    else {
        var related = await fetchRelatedLabelsForMany({
            db,
            collectionName: 'experiment',
            records: docs,
        });

        /*return {
            records: docs,
            ...related
        };*/
    }

}

var fetchRelatedLabelsForMany = async (bag) => {
    var { db, collectionName: collection, records } = bag;

    var { FullSchema } = allSchemaCreators[collection];
    var schema = FullSchema({ enableInternalProps: true });

    var possibleRefs = resolvePossibleRefs(schema, {
        systemTypes: [ 'ForeignId', 'HelperSetItemId', 'CustomRecordTypeKey' ]
    });


    // FIXME: this works only wehn we have no id collisions
    // accross collections, which might not be the case
    var record = records[0];

    var gathered = {};
    for (var ref of possibleRefs) {
        var { schemaPointer, systemType, systemProps } = ref;
        var path = convertSchemaPointerToMongoPath(schemaPointer);

        var result = queryObject({
            from: record,
            path
        });

        if (result) {
            var pointer;
            if (systemType === 'ForeignId') {
                pointer = `/records/${systemProps.collection}/ids`;
            }
            else if (systemType === 'HelperSetItemId') {
                pointer = '/helperSetItems/ids';
            }
            else if (systemType === 'CustomRecordTypeKey') {
                pointer = '/customRecordTypes/types'
            }

            forcePush(
                gathered, pointer,
                ...arrify(result)
            );
        }
    }

    var collections = Object.keys(gathered.records);
    for (var c of collections) {
        var it = gathered[records][c];
        var { ids } = it;
        // FIXME: slow maybe => project maybe
        var docs = (
            await db.collection(c).aggregate([
                { $match: {
                    _id: { $in: ids }
                }}
            ]).toArray()
        );


    }
    
}

var itemizeKeys = (bag) => {
    var { from, key = 'key', merge = false } = bag;
    return Object.keys(from).map(k => {
        var value = from[k];
        return (
            mergeKey
            ? { [key]: k, ...value }
            : { [key]: k, value }
        );
    });
}

// FIXME: epic name bro
var forcePush = (that, pointer, ...values) => {
    if (!jsonpointer.get(that, pointer)) {
        jsonpointer.set(that, pointer, []);
    }
    jsonpointer.get(that, pointer).push(...values);
}

var fetchRelatedRecordLabels = async (bag) => {
    var { records, schema } = bag;

    var refValuesByCollection = {};
    for (var record of records) {
        var possibleRefs = resolvePossibleRefs(schema, {})
    }
}

module.exports = relatedExperiments;
