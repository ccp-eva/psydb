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
    // NOTE: also we want to configure tasts which is a list of objects
    //var studyRoadmapCRTSettings = CRTSettings({ data: {
    //}});

    validateMessageOrThrow({
        handler, message, schema: FullSchema({
            apiConfig, studyCRTSettings, /*studyRoadmapCRTSettings*/
        }),
    });

    cache.merge({ studyCRTSettings, /*studyRoadmapCRTSettings*/ });
}

module.exports = { validateMessage };
