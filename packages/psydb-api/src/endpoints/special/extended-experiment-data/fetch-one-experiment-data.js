'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:extendedExperimentData'
);

var { ejson } = require('@mpieva/psydb-core-utils');

var {
    StripEventsStage,
    AddLastKnownEventIdStage
} = require('@mpieva/psydb-mongo-stages');

var {
    ApiError,
    fetchRecordById,
    createSchemaForRecordType,
    fetchRelatedLabels
} = require('@mpieva/psydb-api-lib');

var fetchOneExperimentData = async (options) => {
    var {
        db,
        experimentType,
        experimentId,
        permissions,
    } = options;

    debug('fetch experiment record');
    var experimentRecords = await (
        db.collection('experiment').aggregate([
            { $match: {
                _id: experimentId,
                $or: [
                    { type: experimentType },
                    { realType: experimentType },
                ]
            }},
            AddLastKnownEventIdStage(),
            StripEventsStage(),
        ]).toArray()
    );
    var experimentRecord = experimentRecords[0];

    //console.dir(ejson(experimentRecord), { depth: null });

    // FIXME: question is should we 404 or 403 when access is denied?
    // well 404 for now and treat it as if it wasnt found kinda
    if (!experimentRecord) {
        debug('=> 404');
        throw new ApiError(404, 'NoAccessibleExperimentRecordFound');
    }

    debug('fetch experiment record schema');
    var experimentRecordSchema = await createSchemaForRecordType({
        db,
        collectionName: 'experiment',
        recordType: experimentType,
        fullSchema: true
    });

    debug('fetch experiment related labels');
    var experimentRelated = await fetchRelatedLabels({
        db,
        data: experimentRecord,
        schema: experimentRecordSchema,
    });

    return {
        record: experimentRecord,
        related: experimentRelated,
    }
}

module.exports = fetchOneExperimentData;
