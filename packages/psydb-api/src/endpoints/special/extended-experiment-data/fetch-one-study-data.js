'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:extendedExperimentData'
);

var {
    createSchemaForRecordType,
    fetchRelatedLabels,
} = require('@mpieva/psydb-api-lib');

var fetchOneStudyData = async (options) => {
    var { db, _id } = options;

    debug('fetch study record');
    var studyRecord = await (
        db.collection('study').findOne({
            _id
        }, { projection: { _rohrpostMetadata: false }})
    );

    debug('fetch study record schema');
    var studyRecordSchema = await createSchemaForRecordType({
        db,
        collectionName: 'study',
        recordType: studyRecord.type,
        fullSchema: true
    });

    debug('fetch study related labels');
    var studyRelated = await fetchRelatedLabels({
        db,
        data: studyRecord,
        schema: studyRecordSchema,
    });

    return {
        record: studyRecord,
        related: studyRelated,
    }
}

module.exports = fetchOneStudyData;
