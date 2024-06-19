'use strict';
var { without } = require('@mpieva/psydb-core-utils');
var { CRTSettingsList } = require('@mpieva/psydb-common-lib');
var {
    compose,
    switchComposition,
    
    ApiError,
    FakeAjvError,
    withRetracedErrors,
    aggregateOne,
    fetchCRTSettings,
} = require('@mpieva/psydb-api-lib');

var {
    noop, // FIXME: move to api-lib
    verifyOneRecord
} = require('@mpieva/psydb-api-message-handler-lib');

var { checkAgeFrameIntervalIsPlausible } = require('../utils');


var compose_verifyAllowedAndPlausible = () => compose([
    verifyInterval,

    verifyPermissions,
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
    var { db, message, cache } = context;
    var { id, props } = message.payload;
    var { conditions } = props;

    var currentAgeFrameRecord = await withRetracedErrors(
        aggregateOne({ db, ageFrame: [
            { $match: { _id: id }}
        ]})
    );

    var subjectCRT = await fetchCRTSettings({
        db,
        collectionName: 'subject',
        recordType: currentAgeFrameRecord.subjectTypeKey,
        wrap: true
    });

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
    
    cache.merge({ subjectCRT });
}

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
