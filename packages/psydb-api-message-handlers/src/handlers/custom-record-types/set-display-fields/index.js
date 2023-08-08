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

var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var SimpleHandler = require('../../../lib/simple-handler'),
    PutMaker = require('../../../lib/put-maker');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'custom-record-types/set-display-fields',
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
        fieldPointers,
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
    for (var fieldPointer of fieldPointers) {
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

    var {
        id,
        lastKnownEventId,
        target,
    } = payload;

    var {
        gatheredFieldData
    } = cache;

    var path = getPathForTarget(target);

    await dispatch({
        collection: 'customRecordType',
        channelId: id,
        payload: { $set: {
            [path]: gatheredFieldData
        }}
    });
}

var getPathForTarget = (target) => {
    switch (target) {
        case 'table':
            return 'state.tableDisplayFields';
        case 'optionlist':
            return 'state.optionListDisplayFields';
        case 'extra-description':
            return 'state.extraDescriptionDisplayFields';
        case 'selection-summary':
            return 'state.selectionSummaryDisplayFields';
        case 'invite-confirm-summary':
            return 'state.inviteConfirmSummaryDisplayFields';
        case 'invite-selection-list':
            return 'state.selectionRowDisplayFields';
        case 'away-team-selection-list':
            return 'state.awayTeamSelectionRowDisplayFields';
        default:
            throw new Error(`unknown target "${target}"`);
    }
}

module.exports = handler;
