'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:extendedExperimentData'
);

var {
    createSchemaForRecordType,
    fetchRelatedLabelsForMany,
} = require('@mpieva/psydb-api-lib');

var fetchOneStudyData = async (options) => {
    var { db, timezone, _id } = options;

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
    var studyRelated = await fetchRelatedLabelsForMany({
        db,
        collectionName: 'study',
        records: [ studyRecord ],
        timezone,
    });

    return {
        record: studyRecord,
        related: studyRelated,
    }
}

module.exports = fetchOneStudyData;
