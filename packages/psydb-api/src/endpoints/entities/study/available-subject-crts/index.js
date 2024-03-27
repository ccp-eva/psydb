'use strict';
var { unique } = require('@mpieva/psydb-core-utils');
var { SmartArray } = require('@mpieva/psydb-common-lib');
var {
    ResponseBody,
    validateOrThrow,
    withRetracedErrors,
    aggregateToArray,
    aggregateOne,
    fetchAllCRTSettings
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');


var availableSubjectCRTs = async (context, next) => {
    var { db, permissions, request } = context;
    
    await validateOrThrow({
        schema: Schema(),
        payload: request.body
    });

    var { studyId } = request.body;

    var study = await withRetracedErrors(
        aggregateOne({ db, study: [
            { $match: { _id: studyId }}
        ]})
    );

    var researchGroups = await withRetracedErrors(
        aggregateToArray({ db, researchGroup: [
            { $match: {
                _id: { $in: study.state.researchGroupIds }
            }}
        ]})
    );
    var subjectTypes = unique(SmartArray([
        ...researchGroups.map(it => it.state.subjectTypes)
    ], { spreadArrayItems: true }).map(it => it.key));

    var subjectCRTs = await fetchAllCRTSettings(db, [{
        collection: 'subject',
        recordTypes: subjectTypes
    }], { wrap: false, asTree: false });

    context.body = ResponseBody({
        data: {
            crts: subjectCRTs,
        },
    });

    await next();
}

module.exports =  { availableSubjectCRTs };
