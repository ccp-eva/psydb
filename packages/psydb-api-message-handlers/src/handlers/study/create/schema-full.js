'use strict';
var { ClosedObject, ForeignId } = require('@mpieva/psydb-schema-fields');
var { Study, StudyRoadmap } = require('@mpieva/psydb-schema-creators');

var SchemaFull = (bag) => {
    var { apiConfig, studyCRTSettings, /*studyRoadmapCRTSettings*/ } = bag;
    var { dev_enableStudyRoadmap = false } = apiConfig;

    var schema = ClosedObject({
        'type': CustomRecordTypeKey({ collection: 'study' }),
        'props': Study.State({
            apiConfig,
            crtSettings: studyCRTSettings,
            //customFieldDefinitions: studyCRTSettings.allCustomFields()
        }),
        ...(dev_enableStudyRoadmap && {
            //'type': CustomRecordTypeKey({ collection: 'studyRoadmap' }),
            'studyRoadmap': ClosedObject({
                'props': StudyRoadmap.State({
                    apiConfig,
                    /*crtSettings: studyRoadmapCRTSettings*/
                })
            })
        })
    });
    
    return schema;
}

module.exports = SchemaFull;
