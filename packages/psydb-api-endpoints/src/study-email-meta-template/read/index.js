'use strict';
var debug = require('../debug-helper')('read');

var { keyBy } = require('@mpieva/psydb-core-utils');
var { aggregateOne, aggregateToArray }
    = require('@mpieva/psydb-mongo-adapter');
var { SystemPermissionStages } = require('@mpieva/psydb-mongo-stages');
var { fetchRecordLabelsManual } = require('@mpieva/psydb-db-utils');
var { ApiError, ResponseBody, validateOrThrow }
    = require('@mpieva/psydb-api-lib');

var BodySchema = require('./body-schema');


var readEndpoint = async (context, next) => {
    var { db, request, permissions, i18n } = context;

    if (!permissions.hasCollectionFlag('studyEmailMetaTemplate', 'read')) {
        throw new ApiError(403);
    }
    
    validateOrThrow({
        schema: BodySchema(),
        payload: request.body,
    });
    
    var { studyEmailMetaTemplateId } = request.body;
    
    var record = await aggregateOne({ db, studyEmailMetaTemplate: [
        { $match: { '_id': studyEmailMetaTemplateId }},
        ...SystemPermissionStages({
            collection: 'studyEmailMetaTemplate', permissions
        }),
    ]});

    // NOTE: treating inaccessible as not found like the other endpoints
    if (!record) {
        throw new ApiError(404, 'NoAccessibleRecordFound');
    }

    var { accessRightsByResearchGroup } = record.state.systemPermissions;
    var relatedRecordLabels = await fetchRecordLabelsManual(db, {
        'researchGroup': accessRightsByResearchGroup.map(
            it => it.researchGroupId
        ),
    }, { ...i18n, oldWrappedLabels: true });

    // NOTE: file/read is root only; this lets users see attachment
    // names of templates they have access to
    var files = await aggregateToArray({ db, file: [
        { $match: { _id: { $in: record.state.mailAttachments.map(
            it => it.fileId
        )}}},
        { $project: { _id: true, originalFilename: true, mimetype: true }},
    ]});

    context.body = ResponseBody({
        data: {
            record, related: {
                relatedRecordLabels,
                files: keyBy({ items: files, byProp: '_id' }),
            },
        },
    });

    await next();
}

module.exports = readEndpoint;
