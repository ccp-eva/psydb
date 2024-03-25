'use strict';

var availableSubjectCRTSettings = async (context, next) => {
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
    ], { spreadArrayItems: true }));

    var subjectCRTs = await fetchAllCRTSettings(db, [{
        collection: 'subject',
        recordTypes: subjectTypes
    }], { wrap: true });

    context.body = ResponseBody({
        data: {
            crts: subjectCRTs,
        },
    });

    await next();
}
