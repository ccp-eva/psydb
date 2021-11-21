'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:availableTestLocationsForStudy'
);

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv');

var ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');
var compareIds = require('@mpieva/psydb-api-lib/src/compare-ids');
var createRecordLabel = require('@mpieva/psydb-api-lib/src/create-record-label');
var fetchRecordById = require('@mpieva/psydb-api-lib/src/fetch-record-by-id');

var availableTestLocationsForStudy = async (context, next) => {
    var { 
        db,
        permissions,
        params,
    } = context;

    var {
        studyId,
        locationRecordTypeId
    } = params;

    // TODO: check params

    var studyRecord = await fetchRecordById({
        db,
        collectionName: 'study',
        id: studyId,
        permissions,
    });

    // TODO: permissions
    // TODO: obsolete?

    // FIXME: question is should we 404 or 403 when access is denied?
    // well 404 for now and treat it as if it wasnt found kinda
    if (!studyRecord) {
        throw new ApiError(404, 'NoAccessibleStudyRecordFound');
    }

    var { inhouseTestLocationSettings } = studyRecord.state;
    var locationTypeSettings = inhouseTestLocationSettings.find(it => (
        compareIds(it.customRecordTypeId, locationRecordTypeId)
    ));

    if (!locationTypeSettings) {
        throw new ApiError(400, 'LocationRecordTypeNotFound');
    }

    var {
        customRecordTypeId,
        enableAllAvailableLocations,
        enabledLocationIds,
    } = locationTypeSettings;

    var customRecordTypeRecord = await (
        db.collection('customRecordType').findOne({
            _id: customRecordTypeId
        })
    );

    var matchStage = (
        enableAllAvailableLocations
        ? ({
            recordType: customRecordTypeRecord.type
        })
        : ({
            _id: { $in: enabledLocationIds }
        })
    );

    var locationRecords = await (
        db.collection('location').aggregate([
            { $match: matchStage },
            { $project: {
                events: false
            }},
        ]).toArray()
    );

    locationRecords.forEach(it => {
        it._recordLabel = createRecordLabel({
            record: it,
            definition: customRecordTypeRecord.state.recordLabelDefinition
        })
    })

    context.body = ResponseBody({
        data: {
            records: locationRecords,
        },
    });

    await next();
};

module.exports = availableTestLocationsForStudy;
