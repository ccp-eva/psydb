'use strict';
var jsonpointer = require('jsonpointer');
var {
    ExactObject,
    StringEnum,
    Integer
} = require('@mpieva/psydb-schema-fields');

var {
    ApiError,
    validateOrThrow,
    fetchRelatedLabelsForMany,
} = require('../index');

var SimpleRecordList = {};

SimpleRecordList.createSchema = () => {
    return ExactObject({
        properties: {
            out: StringEnum([ 'count', 'id-only', 'full' ]),
            limit: Integer({ minimum: 0 }),
            offset: Integer({ minimum: 1 }),
        },
        required: [ 'out' ]
    })
}

SimpleRecordList.fetchData = (context) => async (options) => {
    var { db, payload } = context;

    var { out, limit, offset } = payload;
    var {
        collection,
        filter,
        sort,
        fetchRelated = true
    } = options;

    var stages = [
        filter && { $match: filter },
        out === 'id-only' && { $project: { _id: true }},
        offset && { $skip: offset },
        limit && { $limit: limit },
        out === 'count' && { $count: 'COUNT' },
        sort && { $sort: sort },
    ].filter(it => !!it);

    var records = await db.collection(collection).aggregate(
        stages,
        {
            allowDiskUse: true,
            collation: { locale: 'de@collation=phonebook' }
        }
    ).toArray();

    if (out === 'count') {
        // FIXME: when no records where found it kinda doesnt count
        // but returns an empty array not sure if thats a bug
        if (records.length < 1) {
            return { count: 0 };
        }
        else {
            return { count: records[0].COUNT }
        }
    }
    else if (out === 'id-only') {
        return { records };
    }
    else {
        if (fetchRelated) {
            var related = await fetchRelatedLabelsForMany({
                db,
                collectionName: collection, // XXX: ???
                records,
            });
            //console.dir(related, { depth: null });

            return {
                records,
                ...related
            };
        }
        else {
            return { records };
        }
    }

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

var withContext = (context) => {
    var _SimpleRecordList = { ...SimpleRecordList };
    _SimpleRecordList.fetchData = (
        SimpleRecordList.fetchData(context)
    );

    return {
        SimpleRecordList: _SimpleRecordList,
        augmentWithPayload: (type) => augmentWithPayload(context, type),
        validate: validate(context),
        verifyPayloadId: verifyPayloadId(context),
    }
}

module.exports = {
    withContext,

    SimpleRecordList,
    augmentWithPayload,
    validate,
    verifyPayloadId,
}
