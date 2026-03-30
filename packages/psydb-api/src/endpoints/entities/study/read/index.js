'use strict';
var { aggregateOne } = require('@mpieva/psydb-mongo-adapter');
var { match, projections, SystemPermissionStages }
    = require('@mpieva/psydb-mongo-stages');

var {
    ApiError, ResponseBody, validateOrThrow,
    fetchCRTSettings, fetchRelatedLabelsForMany,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');


var read = async (context, next) => {
    var { db, request, permissions, i18n, apiConfig } = context;
    var { dev_enableStudyRoadmap } = apiConfig;

    validateOrThrow({ schema: Schema(), payload: request.body });
    var { id } = request.body;

    var stub = await aggregateOne({ db, study: { _id: id }});
    if (!stub) {
        throw new ApiError(404, 'NoAccessibleRecordFound');
    }

    var { type } = stub;
    var crtSettings = await fetchCRTSettings({
        db, collectionName: 'study', recordType: type, wrap: true
    });

    var removedFields = crtSettings.findCustomFields({
        'isRemoved': true
    });
    if (!permissions.hasFlag('canAccessSensitiveFields')) {
        removedFields.push(...crtSettings.findCustomFields({
            'props.isSensitive': true
        }));
    }
    
    var record = await aggregateOne({
        db, study: ReadStages({ id, permissions, removedFields })
    });
    // FIXME: question is should we 404 or 403 when access is denied?
    // well 404 for now and treat it as if it wasnt found kinda
    if (!record) {
        throw new ApiError(404, 'NoAccessibleRecordFound');
    }
    
    record._recordLabel = crtSettings.getLabelForRecord({ record, i18n });
    
    var related = await fetchRelatedLabelsForMany({
        db, ...i18n, collectionName: 'study', records: [ record ]
    });

    var studyRoadmap = undefined;
    var studyRoadmapHistory = undefined;
    if (dev_enableStudyRoadmap) {
        studyRoadmap = await aggregateOne({ db, studyRoadmap: {
            studyId: id,
        }});
    }

    context.body = ResponseBody({
        data: {
            record, related, studyRoadmap,
            crtSettings: crtSettings.getRaw()
        }
    });

    await next();
}

var ReadStages = (bag) => {
    var { id, permissions, removedFields } = bag;

    var stages = [
        { $match: { '_id': id }},
        match.isNotRemoved({ subChannels: false }),
        ...SystemPermissionStages({ collection: 'study', permissions }),
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

module.exports = { read };
