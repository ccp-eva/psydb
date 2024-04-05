'use strict';
var { unique } = require('@mpieva/psydb-core-utils');
var {
    ResponseBody,
    validateOrThrow,
    withRetracedErrors,
    aggregateToArray,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');


var enabledCSVImporters = async (context, next) => {
    var { db, permissions, request } = context;
    
    await validateOrThrow({
        schema: Schema(),
        payload: request.body
    });

    var { studyId, subjectType, importType } = request.body;

    var enabledImporters = [];
    if (importType === 'subject') {
        enabledImporters = [ 'default' ]; // TODO
    }
    if (importType === 'experiment') {
        var labWorkflowSettings = await withRetracedErrors(
            aggregateToArray({ db, experimentVariantSetting: [
                { $match: {
                    studyId,
                    'state.subjectTypeKey': subjectType
                }}
            ]})
        );

        for (var it of labWorkflowSettings) {
            var { type } = it;
            if (type === 'apestudies-wkprc-default') {
                enabledImporters.push('wkprc-evapecognition')
            }
        }
    }


    context.body = ResponseBody({
        data: { csvImporters: unique(enabledImporters) },
    });

    await next();
}

module.exports =  { enabledCSVImporters };
