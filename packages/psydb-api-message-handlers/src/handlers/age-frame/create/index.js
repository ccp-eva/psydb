'use strict';
var ApiError = require('@mpieva/psydb-api-lib/src/api-error');
var GenericRecordHandler = require('../../../lib/generic-record-handler');
var checkForeignIdsExist = require('../../../lib/check-foreign-ids-exist');
var checkCRTFieldPointers = require('../../../lib/check-crt-field-pointers');
    
var handler = GenericRecordHandler({
    collection: 'ageFrame',
    op: 'create',

    checkAllowedAndPlausible: async (context) => {
        await GenericRecordHandler.checkAllowedAndPlausible(context);
        
        var {
            db,
            message,
            cache
        } = context;

        var { studyId, subjectTypeKey, props } = message.payload;
        var { conditions } = props;

        await checkForeignIdsExist(db, {
            'study': studyId,
        });
        
        var subjectTypeRecord = await (
            db.collection('customRecordType')
            .findOne(
                { type: subjectTypeKey },
                { projection: { events: false }}
            )
        );

        if (!subjectTypeRecord) {
            throw new ApiError(400, 'InvalidSubjectRecordType');
        }

        if (subjectTypeRecord.collection !== 'subject') {
            throw new ApiError(400, 'InvalidSubjectRecordType');
        }

        var conflictingSelectors = await (
            db.collection('ageFrame')
            .find({
                studyId,
                subjectTypeKey,
            })
            .toArray()
        );

        if (conflictingSelectors.length > 0) {
            throw new ApiError(400, 'SubjectTypeConflictsWithOtherSelector');
        }

        var pointers = conditions.map((it) => it.pointer);
        checkCRTFieldPointers({
            crt: subjectTypeRecord,
            pointers,
        });

        cache.subjectTypeRecord = subjectTypeRecord;
    }
});

module.exports = handler;
