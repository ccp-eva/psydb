'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    compareIds = require('@mpieva/psydb-api-lib/src/compare-ids'),
    createSchemaForRecordType = require('@mpieva/psydb-api-lib/src/create-schema-for-record-type');

var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var resolveDataPointer = require('@mpieva/psydb-api-lib/src/resolve-data-pointer');

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
    if (!permissions.hasRootAccess) {
        //throw new ApiError(403);
    }

    var {
        id,
        lastKnownEventId,
        fieldPointers,
    } = message.payload;

    var record = await (
        db.collection('customRecordType').findOne({
            _id: id
        })
    );

    if (!record) {
        throw new ApiError(404, 'CustomRecordTypeNotFound');
    }
    
    if (!compareIds(record.events[0]._id, lastKnownEventId)) {
        throw new ApiError(400, 'RecordHasChanged');
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

    console.log(targetRecordSchema);

    var gatheredFieldData = [];
    for (var fieldPointer of fieldPointers) {
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

    var channel = (
        rohrpost
        .openCollection('customRecordType')
        .openChannel({
            id
        })
    );

    var pointer = getPointerForTarget(target);

    var messages = PutMaker({ personnelId }).all({
        [pointer]: gatheredFieldData,
    });

    await channel.dispatchMany({
        lastKnownEventId,
        messages,
    });
}

var getPointerForTarget = (target) => {
    switch (target) {
        case 'table':
            return '/state/tableDisplayFields';
        case 'optionlist':
            return '/state/optionListDisplayFields';
        case 'extra-description':
            return '/state/extraDescriptionDisplayFields';
        case 'selection-summary':
            return '/state/selectionSummaryDisplayFields';
        case 'invite-confirm-summary':
            return '/state/inviteConfirmSummaryDisplayFields';
        default:
            throw new Error(`unknown target "${target}"`);
    }
}

module.exports = handler;
