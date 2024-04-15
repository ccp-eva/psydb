'use strict';
var { 
    ApiError,
    FakeAjvError
} = require('@mpieva/psydb-api-lib');

var GenericRecordHandler = require('../../../lib/generic-record-handler');
var checkForeignIdsExist = require('../../../lib/check-foreign-ids-exist');
var checkCRTFieldPointers = require('../../../lib/check-crt-field-pointers');

var { checkAgeFrameIntervalIsPlausible } = require('../utils');
    
var handler = GenericRecordHandler({
    collection: 'ageFrame',
    op: 'patch',

    checkAllowedAndPlausible: async (context) => {
        // TODO: permissions
        await GenericRecordHandler.checkAllowedAndPlausible(context);
        
        var {
            db,
            message,
            cache
        } = context;

        var { id, props } = message.payload;
        var { interval, conditions } = props;

        if (!checkAgeFrameIntervalIsPlausible(interval)) {
            throw new ApiError(400, {
                apiStatus: 'InvalidMessageSchema',
                data: { ajvErrors: [
                    FakeAjvError({
                        dataPath: '/payload/props/interval/end',
                        errorClass: 'ImplausibleIntervalEnd',
                        message: 'Ende muss größer sein als Start',
                    })
                ]}
            });
        }

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
