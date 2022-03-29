'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var {
    ApiError,
    createSchemaForRecordType,
    resolveDataPointer
} = require('@mpieva/psydb-api-lib');

var { SimpleHandler } = require('../../../lib');
var createSchema = require('./schema');


var handler = SimpleHandler({
    messageType: 'custom-record-types/set-form-order',
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
        formOrder,
    } = message.payload;

    var record = await (
        db.collection('customRecordType').findOne({ _id: id })
    );
    if (!record) {
        throw new ApiError(404, 'CustomRecordTypeNotFound');
    }
    
    //console.dir(record, { depth: null });

    var targetRecordSchema = await createSchemaForRecordType({
        db,
        collectionName: record.collection,
        recordType: record.type,
        fullSchema: true,
        additionalSchemaCreatorArgs: {
            enableOnlineId: record.collection === 'subject' ? true : false,
            enableSequenceNumber: true,
        }
    });

    //console.log(targetRecordSchema);

    var gatheredFieldData = [];
    for (var fieldPointer of formOrder) {
        var resolved = resolveDataPointer({
            schema: targetRecordSchema,
            pointer: fieldPointer
        });
        if (!resolved) {
            debug(record.collection, record.type, fieldPointer, 'notResolved');
            throw new ApiError(400, 'InvalidFieldPointer');
        }
        if (!resolved.schema.systemType) {
            debug(record.collection, record.type, fieldPointer, 'noType');
            throw new ApiError(400, 'InvalidFieldPointer');
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

    var { id } = payload;
    var { gatheredFieldData } = cache;

    await dispatch({
        collection: 'customRecordType',
        channelId: id,
        payload: { $set: {
            'state.formOrder': gatheredFieldData.map(it => it.dataPointer)
        }}
    });
}

module.exports = handler;
