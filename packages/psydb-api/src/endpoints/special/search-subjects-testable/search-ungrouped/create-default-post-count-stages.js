'use strict';
var { ejson, convertPointerToPath } = require('@mpieva/psydb-core-utils');
var {
    SeperateRecordLabelDefinitionFieldsStage,
    ProjectDisplayFieldsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');


var createDefaultPostCountStages = (bag) => {
    var {
        studyIds,
        subjectDisplayFields,
        subjectRecordLabelDefinition,

        limit,
        offset,
        
        dobFieldPointer,
    } = bag;

    var stages = [
        { $facet: {
            records: [
                { $sort: {
                    [convertPointerToPath(dobFieldPointer)]: 1
                }},
                { $skip: offset },
                { $limit: limit },
                SeperateRecordLabelDefinitionFieldsStage({
                    recordLabelDefinition: subjectRecordLabelDefinition
                }),
                ProjectDisplayFieldsStage({
                    displayFields: subjectDisplayFields,
                    additionalProjection: {
                        '_recordLabelDefinitionFields': true,
                        '_ageFrameField': true,
                        'scientific.state.internals.participatedInStudies': true,
                        ...( studyIds.reduce((acc, id) => ({
                            ...acc, [`_testableIn_${id}`]: true,
                        }), {}))
                    }
                }),
            ],
            recordsCount: [{ $count: 'COUNT' }]
        }}
    ];

    return stages;
}

module.exports = createDefaultPostCountStages;
