'use strict';
var ApiError = require('@mpieva/psydb-api-lib/src/api-error');
var GenericRecordHandler = require('../../../lib/generic-record-handler');
var checkForeignIdsExist = require('../../../lib/check-foreign-ids-exist');
    
var handler = GenericRecordHandler({
    collection: 'studyTopic',
    op: 'create',

    checkAllowedAndPlausible: async (context) => {
        // TODO: permissions
        await GenericRecordHandler.checkAllowedAndPlausible(context);
        
        var {
            db,
            message,
            cache
        } = context;

        var { props } = message.payload;
        var { parentId } = props;

        if (parentId) {
            await checkForeignIdsExist(db, {
                'studyTopic': parentId,
            });
        }
    }
});

module.exports = handler;
