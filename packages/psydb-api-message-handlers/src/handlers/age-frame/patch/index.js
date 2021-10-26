'use strict';
var ApiError = require('@mpieva/psydb-api-lib/src/api-error');
var GenericRecordHandler = require('../../../lib/generic-record-handler');
var checkForeignIdsExist = require('../../../lib/check-foreign-ids-exist');
var checkCRTFieldPointers = require('../../../lib/check-crt-field-pointers');
    
var handler = GenericRecordHandler({
    collection: 'ageFrame',
    op: 'patch',

    checkAllowedAndPlausible: async (context) => {
        await GenericRecordHandler.checkAllowedAndPlausible(context);
        
        var {
            db,
            message,
            cache
        } = context;

        var { id, props } = message.payload;
        var { conditions } = props;

        var ageFrameRecord = await (
            db.collection('ageFrame')
            .findOne(
                { _id: id },
                { projection: { events: false }}
            )
        );

        var { subjectTypeKey } = ageFrameRecord;

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

        var pointers = conditions.map((it) => it.pointer);
        checkCRTFieldPointers({
            crt: subjectTypeRecord,
            pointers,
        });

        cache.subjectTypeRecord = subjectTypeRecord;
    }
});

module.exports = handler;
