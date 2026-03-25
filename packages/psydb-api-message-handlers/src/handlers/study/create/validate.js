'use strict';
var { CRTSettings } = require('@mpieva/psydb-common-lib');
var { ApiError, validateMessageOrThrow, fetchCRTSettings }
    = require('@mpieva/psydb-api-lib');

var CoreSchema = require('./schema-core');
var FullSchema = require('./schema-full');

var validateMessage = async (context) => {
    var { db, message, handler, cache, apiConfig } = context;

    validateMessageOrThrow({
        handler, message, schema: CoreSchema(),
    });

    var { type: studyType } = message.payload;

    var studyCRTSettings = await fetchCRTSettings({
        db, collectionName: 'study', recordType: studyType, wrap: true
    });
    // NOTE: we dont have to do this and its not clear where this is going
    //var studyRoadmapCRTSettings = CRTSettings({ data: {
    //    fieldDefinitions: [
    //        {
    //            key: 'start',
    //            systemType: 'DateOnlyServerSide',
    //            pointer: '/state/start',
    //            props: { isNullable: false }
    //        },
    //        {
    //            key: 'end',
    //            systemType: 'DateOnlyServerSide',
    //            pointer: '/state/end',
    //            props: { isNullable: false }
    //        },
    //        {
    //            key: 'description',
    //            systemType: 'SaneString',
    //            pointer: '/state/description',
    //            props: { minLength: 1 }
    //        },
    //        {
    //            key: 'status',
    //            systemType: 'SaneString',
    //            pointer: '/state/status',
    //            props: { minLength: 1 }
    //        },
    //        {
    //            key: 'assignedTo',
    //            systemType: 'ForeignId',
    //            pointer: '/state/assignedTo',
    //            props: { collection: 'personnel', isNullable: false }
    //        },
    //    ]
    //}});

    validateMessageOrThrow({
        handler, message, schema: FullSchema({
            apiConfig, studyCRTSettings, /*studyRoadmapCRTSettings*/
        }),
    });

    cache.merge({ studyCRTSettings, /*studyRoadmapCRTSettings*/ }),
}

module.exports = { validateMessage };
