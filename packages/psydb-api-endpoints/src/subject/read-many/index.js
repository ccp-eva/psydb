'use strict';
var { unique } = require('@mpieva/psydb-core-utils');
var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');
var {
    match, projections,
    SystemPermissionStages
} = require('@mpieva/psydb-mongo-stages');

var {
    ApiError,
    ResponseBody,
    validateOrThrow,

    fetchCRTSettings,
    fetchRelatedLabelsForMany,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');


var readMany = async (context, next) => {
    var { db, request, permissions, i18n } = context;

    validateOrThrow({ schema: Schema(), payload: request.body });
    var { ids } = request.body;

    var stubs = await aggregateToArray({ db, subject: { _id: { $in: ids }}});
    if (stubs.length < 1) {
        throw new ApiError(404, 'NoAccessibleRecordFound');
    }
    if (unique(stubs.map(it => it.type)).length > 1) {
        throw new ApiError(409, 'MixedRecordTypesDetected');
    }

    var { type } = stubs[0];
    // FIXME: fetch-record-type has a fixme here an im not sure why
    var crt = await fetchCRTSettings({
        db, collectionName: 'subject', recordType: type, wrap: true
    });

    var removedFields = crt.findCustomFields({
        'isRemoved': true
    });
    if (!permissions.hasFlag('canAccessSensitiveFields')) {
        removedFields.push(...crt.findCustomFields({
            'props.isSensitive': true
        }));

        // FIXME: i dont think this was replaced by the prop 'isSensitive'
        if (crt.getRaw().commentFieldIsSensitive) {
            removedFields.push({ pointer: '/scientific/state/comment' });
        }
    }

    var records = await aggregateToArray({
        db, subject: ReadManyStages({ ids, permissions, removedFields })
    });
    // FIXME: question is should we 404 or 403 when access is denied?
    // well 404 for now and treat it as if it wasnt found kinda
    if (records.length < 1) {
        throw new ApiError(404, 'NoAccessibleRecordFound');
    }

    for (var it of records) {
        it._recordLabel = crt.getLabelForRecord({ record: it, i18n });
    }
    var related = await fetchRelatedLabelsForMany({
        db, ...i18n, collectionName: 'subject', records
    });

    context.body = ResponseBody({
        data: {
            records, related, crtSettings: crt.getRaw(),
            ...related, // FIXME
        }
    });

    await next();
}

var ReadManyStages = (bag) => {
    var { ids, permissions, removedFields } = bag;

    var stages = [
        { $match: { '_id': { $in: ids }}},
        match.isNotRemoved({ hasSubChannels: true }),
        ...SystemPermissionStages({ collection: 'subject', permissions }),
    ];
    if (removedFields.length > 0) {
        stages.push(projections.OmitFields({ definitions: removedFields }));
    }

    return stages;
}
// ReadStages.MatchesIdIn = ...
// ReadStages.IsNotRemoved = ...
// ReadStages.MatchesPermissions = ...
// ReadStages.OmitFields = ...
module.exports = readMany;
