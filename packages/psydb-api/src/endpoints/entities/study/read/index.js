'use strict';
var { copy } = require('@mpieva/psydb-core-utils');
var { spoolEvents } = require('@mpieva/psydb-rohrpost-utils');

var { aggregateOne, aggregateToArray }
    = require('@mpieva/psydb-mongo-adapter');
var { match, projections, SystemPermissionStages }
    = require('@mpieva/psydb-mongo-stages');

var {
    ApiError, ResponseBody, validateOrThrow,
    fetchCRTSettings, fetchRelatedLabelsForMany,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');


var read = async (context, next) => {
    var { db, request, permissions, i18n, apiConfig } = context;

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

    var { studyRoadmap, studyRoadmapVersions }
        = await maybeHandleStudyRoadmap(context);

    context.body = ResponseBody({
        data: {
            record, related, studyRoadmap, studyRoadmapVersions,
            crtSettings: crtSettings.getRaw()
        }
    });

    await next();
}

var maybeHandleStudyRoadmap = async (context) => {
    var { db, request, apiConfig } = context;
    var { dev_enableStudyRoadmap } = apiConfig;
    var { id: studyId } = request.body;

    var fallback = {
        studyRoadmap: undefined,
        studyRoadmapHistory: undefined
    };
    
    if (!dev_enableStudyRoadmap) {
        return fallback;
    }

    var studyRoadmap = await aggregateOne({ db, studyRoadmap: { studyId }});

    if (!studyRoadmap) {
        return fallback;
    }
    
    var events = await aggregateToArray({ db, rohrpostEvents: {
        _id: { $in: studyRoadmap._rohrpostMetadata.eventIds  }
    }});

    var studyRoadmapVersions = [];
    var current = undefined
    for (var it of events.reverse()) {
        var next = spoolEvents({ onto: copy(current), events: [ it ] });
        studyRoadmapVersions.push(next);
    }

    studyRoadmapVersions.reverse();
    return { studyRoadmap, studyRoadmapVersions }
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
