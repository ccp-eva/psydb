'use strict';
var { without } = require('@mpieva/psydb-core-utils');
var { CRTSettingsList } = require('@mpieva/psydb-common-lib');
var {
    compose,
    switchComposition,
    
    ApiError,
    FakeAjvError,
    fetchAvailableCRTSettings,
} = require('@mpieva/psydb-api-lib');

var {
    noop, // FIXME: move to api-lib
    verifyOneRecord
} = require('@mpieva/psydb-api-message-handler-lib');

var { checkAgeFrameIntervalIsPlausible } = require('../utils');


var compose_verifyAllowedAndPlausible = () => compose([
    verifyInterval,

    verifyPermissions,
    verifyStudyRecord,
    verifySubjectSelectorRecord,
    verifySubjectType,

    verifyConditionFieldPointers,
]);

var verifyInterval = async (context, next) => {
    var { message } = context;
    var { interval } = message.payload.props;

    if (!checkAgeFrameIntervalIsPlausible(interval)) {
        throw new ApiError(400, {
            apiStatus: 'InvalidMessageSchema',
            data: { ajvErrors: [
                FakeAjvError({
                    dataPath: '/payload/props/interval/end',
                    errorClass: 'ImplausibleIntervalEnd',
                    // FIXME: translation
                    message: 'Ende muss größer sein als Start',
                })
            ]}
        });
    }

    await next();
}

var verifyPermissions = async (context, next) => {
    var { db, permissions, message } = context;
    var { studyId, subjectSelectorId, subjectTypeKey } = message.payload;
    
    if (!permissions.hasCollectionFlag('study', 'write')) {
        // TODO: check individual study
        throw new ApiError(403);
    }
    if (!permissions.hasCollectionFlag('ageFrame', 'write')) {
        throw new ApiError(403);
    }

    await next();
}

var verifySubjectType = async (context, next) => {
    var { db, message, cache } = context;
    var { studyId, subjectTypeKey } = message.payload;
    
    var subjectCRTs = await fetchAvailableCRTSettings({
        db, collections: [ 'subject' ], byStudyId: studyId,
        wrap: false, asTree: false
    });
    // FIXME: move that into above when asTree is false
    var subjectCRT = CRTSettingsList({ items: subjectCRTs }).find({
        'type': subjectTypeKey
    });

    if (!subjectCRT) {
        throw new ApiError(400, 'InvalidSubjectRecordType');
    }

    cache.merge({ subjectCRT });
    await next();
}

var verifyConditionFieldPointers = async (context, next) => {
    var { message, cache } = context;
    var { conditions } = message.payload.props;
    var { subjectCRT } = cache.get();

    var pointers = conditions.map(it => it.pointer);
    var found = subjectCRT.findCustomFields({
        'pointer': { $in: pointers }
    });
    if (found.length !== pointers.length) {
        throw new ApiError(400, {
            apiStatus: 'InvalidCRTFieldPointers',
            data: {
                invalidPointers: without({
                    that: pointers,
                    without: found.map(it => it.pointer)
                })
            }
        });
    }
}

var verifyStudyRecord = verifyOneRecord({
    collection: 'study',
    by: '/payload/studyId',
});

var verifySubjectSelectorRecord = verifyOneRecord({
    collection: 'subjectSelector',
    by: '/payload/subjectSelectorId',
});


module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
