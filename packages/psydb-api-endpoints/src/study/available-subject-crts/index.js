'use strict';
var {
    ResponseBody,
    validateOrThrow,
    fetchAvailableCRTSettings,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');


var availableSubjectCRTs = async (context, next) => {
    var { db, permissions, request } = context;
    
    await validateOrThrow({
        schema: Schema(),
        payload: request.body
    });

    var { studyId } = request.body;

    var subjectCRTs = await fetchAvailableCRTSettings({
        db, collections: [ 'subject' ], byStudyId: studyId,
        wrap: false, asTree: false
    })

    context.body = ResponseBody({
        data: { crts: subjectCRTs },
    });

    await next();
}

module.exports =  { availableSubjectCRTs };
