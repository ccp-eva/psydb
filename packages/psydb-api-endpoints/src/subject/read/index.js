'use strict';
var { aggregateOne } = require('@mpieva/psydb-mongo-adapter');
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


var read = async (context, next) => {
    var { db, request, permissions, i18n } = context;

    validateOrThrow({
        schema: Schema(),
        payload: request.body
    });

    var { id } = request.body;

    var stub = await aggregateOne({ db, subject: { _id: id }});
    if (!stub) {
        throw new ApiError(404, 'NoAccessibleRecordFound');
    }
    var { type } = stub;
    
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

    var record = await aggregateOne({
        db, subject: ReadStages({ id, permissions, removedFields })
    });
    // FIXME: question is should we 404 or 403 when access is denied?
    // well 404 for now and treat it as if it wasnt found kinda
    if (!record) {
        throw new ApiError(404, 'NoAccessibleRecordFound');
    }

    record._recordLabel = crt.getLabelForRecord({ record, i18n });
    
    var related = await fetchRelatedLabelsForMany({
        db, ...i18n, collectionName: 'subject', records: [ record ]
    });

    context.body = ResponseBody({
        data: { record, related }
    });

    await next();
}

var ReadStages = (bag) => {
    var { id, permissions, removedFields } = bag;

    var stages = [
        { $match: { '_id': id }},
        match.isNotRemoved({ subChannels: true }),
        ...SystemPermissionStages({ collection: 'subject', permissions }),
    ];
    if (removedFields.length > 0) {
        stages.push(projections.OmitFields({ definitions: removedFields }));
    }

    return stages;
}
// ReadStages.MatchesId = ...
// ReadStages.IsNotRemoved = ...
// ReadStages.MatchesPermissions = ...
// ReadStages.OmitFields = ...

module.exports = read;
