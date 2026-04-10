'use strict';
var { ClosedObject, ForeignId } = require('@mpieva/psydb-schema-fields');
var { Study, StudyRoadmap } = require('@mpieva/psydb-schema-creators');

var SchemaFull = (bag) => {
    var { apiConfig, studyCRTSettings } = bag;
    var { dev_enableStudyRoadmap = false } = apiConfig;

    var schema = ClosedObject({
        '_id': ForeignId({ collection: 'study' }),
        'props': Study.State({
            apiConfig,
            crtSettings: studyCRTSettings,
        }),
        ...(dev_enableStudyRoadmap && {
            'studyRoadmap': ClosedObject({
                'props': StudyRoadmap.State({ apiConfig })
            })
        })
    });
    
    return schema;
}

module.exports = SchemaFull;
