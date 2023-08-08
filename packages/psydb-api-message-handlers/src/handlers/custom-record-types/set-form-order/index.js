'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { keyBy, compareIds } = require('@mpieva/psydb-core-utils');
var {
    convertCRTRecordToSettings,
    CRTSettings
} = require('@mpieva/psydb-common-lib');

var {
    ApiError,
    createSchemaForRecordType,
    resolveDataPointer,
    fetchCRTSettingsById,
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
    if (!permissions.isRoot()) {
        throw new ApiError(403);
    }

    var {
        id,
        formOrder,
    } = message.payload;

    var crtSettings = await fetchCRTSettingsById({
        db, id, wrap: true
    });

    var { collection, type } = crtSettings.getRaw();

    var definitionsByPointer = keyBy({
        items: crtSettings.allFieldDefinitions(),
        byProp: 'pointer',
    });
    
    //console.dir(record, { depth: null });

    var targetRecordSchema = await createSchemaForRecordType({
        db,
        collectionName: collection,
        recordType: type,
        fullSchema: true,
        additionalSchemaCreatorArgs: {
            enableOnlineId: collection === 'subject' ? true : false,
            enableSequenceNumber: true,
        }
    });

    //console.log(targetRecordSchema);

    var gatheredFieldData = [];
    for (var fieldPointer of formOrder) {
        var def = definitionsByPointer[fieldPointer];
        if (def && def.systemType === 'Lambda') {
            gatheredFieldData.push({
                systemType: def.systemType,
                dataPointer: fieldPointer,
            });
        }
        else {
            var resolved = resolveDataPointer({
                schema: targetRecordSchema,
                pointer: fieldPointer
            });
            if (!resolved) {
                debug(collection, type, fieldPointer, 'notResolved');
                throw new ApiError(400, 'InvalidFieldPointer');
            }
            if (!resolved.schema.systemType) {
                debug(collection, type, fieldPointer, 'noType');
                throw new ApiError(400, 'InvalidFieldPointer');
            }
            gatheredFieldData.push({
                systemType: resolved.schema.systemType,
                dataPointer: fieldPointer,
            });
        }
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
