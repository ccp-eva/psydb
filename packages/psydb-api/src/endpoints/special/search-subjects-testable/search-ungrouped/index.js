'use strict';
var debug = require('debug')('psydb:api:endpoints:searchSubjectsUngrouped');

var omit = require('@cdxoo/omit');
var { ejson } = require('@mpieva/psydb-core-utils');

var {
    ResponseBody,
    fromFacets,
} = require('@mpieva/psydb-api-lib');

var {
    initAndCheck,
    combineSubjectResponseData,
} = require('../common-helpers');

var PreCountStages = require('./create-pre-count-stages');
var DefaultPostCountStages = require('./create-default-post-count-stages');

var fetchSubjects = require('./fetch-subjects');
var postprocess = require('./postprocess');

var searchUngrouped = async (context, next) => {
    var { 
        db,
        permissions,
        request,
        i18n,

        experimentVariant,
    } = context;

    var prepared = await initAndCheck({
        db,
        permissions,
        request,
        labProcedureType: experimentVariant,
    });

    var {
        studyRecords,
        studyRecordLabelDefinition,

        subjectTypeKey,
        subjectDisplayFields,
        subjectAvailableDisplayFieldData,
        subjectRecordLabelDefinition,

        output = 'full',
    } = prepared;

    var preCountStages = PreCountStages({ experimentVariant, ...prepared });

    if (output === 'only-ids') {
        // FIXME: we currently ignore limit/offset
        var stages = [
            ...preCountStages,
            { $project: { _id: true }}
        ];
        var subjectRecords = await fetchSubjects({
            db, stages, ...prepared
        });

        context.body = ResponseBody({ data: {
            ids: subjectRecords.map(it => it._id)
        }});
    }
    else if (output === 'full') {
        var postCountStages = DefaultPostCountStages({ ...prepared });

        var stages = [
            ...preCountStages,
            ...postCountStages
        ];

        var result = await fetchSubjects({
            db, stages, ...prepared
        });

        //console.dir(stages, { depth: null });
        var [ subjectRecords, subjectRecordsCount ] = fromFacets(result);
        var { upcomingSubjectExperimentData } = await postprocess({
            db, subjectRecords, ...prepared, i18n
        })

        context.body = ResponseBody({
            data: {
                studyData: {
                    records: studyRecords,
                    // FIXME: studyRelated?
                },
                subjectData: await combineSubjectResponseData({
                    db,

                    subjectRecordType: subjectTypeKey,
                    subjectRecords,
                    subjectRecordsCount,
                    subjectAvailableDisplayFieldData,
                    subjectDisplayFields,

                    studyRecords,
                    studyRecordLabelDefinition,
                    subjectRecordLabelDefinition,
                }),
                subjectExperimentMetadata: {
                    ...omit('upcomingForIds', upcomingSubjectExperimentData),
                },
                subjectRecordLabelDefinition,
            }
        });
    }
    
    await next();
}

module.exports = searchUngrouped;
