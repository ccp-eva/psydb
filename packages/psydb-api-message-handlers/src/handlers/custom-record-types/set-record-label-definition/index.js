'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    compareIds = require('@mpieva/psydb-api-lib/src/compare-ids'),
    createSchemaForRecordType = require('@mpieva/psydb-api-lib/src/create-schema-for-record-type');

var resolveDataPointer = require('@mpieva/psydb-api-lib/src/resolve-data-pointer');

var SimpleHandler = require('../../../lib/simple-handler'),
    PutMaker = require('../../../lib/put-maker');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'custom-record-types/set-record-label-definition',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    cache,
    message
}) => {
    if (!permissions.hasRootAccess) {
        //throw new ApiError(403);
    }

    var {
        id,
        lastKnownEventId,
        props,
    } = message.payload;

    var record = await (
        db.collection('customRecordType').findOne({
            _id: id
        })
    );

    if (!record) {
        throw new ApiError(404, 'RecordNotFound');
    }
    
    var targetRecordSchema = await createSchemaForRecordType({
        db,
        collectionName: record.collection,
        recordType: record.type,
        fullSchema: true
    });

    var gatheredFieldData = [];
    for (var fieldPointer of props.tokens) {
        var resolved = resolveDataPointer({
            schema: targetRecordSchema,
            pointer: fieldPointer
        });
        if (!resolved) {
            debug(record.collection, record.type, fieldPointer);
            throw new ApiError(400, 'InvalidFieldPointer');
        }
        if (!resolved.schema.systemType) {
            debug(record.collection, record.type, fieldPointer);
            throw new ApiError(400, 'InvalidFieldPointer');
        }
        if (resolved.schema.systemType === 'ForeignId') {
            // FIXME: we currently cannot handle foreignId in label
            // field since it could lead to circles in graph
            // also depth maybe ...
            throw new ApiError(400, 'ForeignIdFieldNotSupported');
        }
        gatheredFieldData.push({
            // FIXME: not sure if we wanna store that
            //inSchemaPointer: resolved.inSchemaPointer,
            systemType: resolved.schema.systemType,
            dataPointer: fieldPointer,
        });
    }

    cache.gatheredFieldData = gatheredFieldData;
}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    cache,
    message,

    dispatch,
}) => {
    var { personnelId, payload } = message;
    var {
        id,
        lastKnownEventId,
        props
    } = payload;

    var {
        gatheredFieldData
    } = cache;

    await dispatch({
        collection: 'customRecordType',
        channelId: id,
        payload: { $set: {
            'state.recordLabelDefinition': {
                format: props.format,
                tokens: gatheredFieldData
            }
        }}
    });
}

module.exports = handler;
