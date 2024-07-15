'use strict';
var { CRTSettingsList } = require('@mpieva/psydb-common-lib');
var {
    ResponseBody,
    validateOrThrow,
    withRetracedErrors,
    aggregateToArray,
    fetchAvailableCRTSettings,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');


var enabledSubjectCRTs = async (context, next) => {
    var { db, permissions, request } = context;
    
    await validateOrThrow({
        schema: Schema(),
        payload: request.body
    });

    var { studyId } = request.body;

    var _availableSubjectCRTs = await fetchAvailableCRTSettings({
        db, collections: [ 'subject' ], byStudyId: studyId,
        wrap: false, asTree: false
    });
    var availableSubjectCRTs = CRTSettingsList({
        items: _availableSubjectCRTs
    });

    var labWorkflowSettings = await withRetracedErrors(
        aggregateToArray({ db, experimentVariantSetting: [
            { $match: { studyId }}
        ]})
    );

    var enabledSubjectCRTs = availableSubjectCRTs.filter({
        type: { $in: labWorkflowSettings.map(it => it.state.subjectTypeKey )}
    })

    context.body = ResponseBody({
        data: { crts: enabledSubjectCRTs.map(it => it.getRaw()) },
    });

    await next();
}

module.exports =  { enabledSubjectCRTs };
