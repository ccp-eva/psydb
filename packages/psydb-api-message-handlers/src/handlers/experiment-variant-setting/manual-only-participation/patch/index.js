'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { groupBy } = require('@mpieva/psydb-core-utils');
var { ApiError } = require('@mpieva/psydb-api-lib');
var {
    SimpleHandler,
    checkForeignKeyExists,
    checkForeignIdsExist,
} = require('../../../../lib');

var checkBasics = require('../../utils/check-patch-basics');
var checkCRTFieldPointers = require('../../utils/check-crt-field-pointers');
var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment-variant-setting/manual-only-participation/patch',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message,
    cache
}) => {

    await checkBasics({
        db,
        permissions,
        cache,
        message,
    });

    var { subjectTypeRecord } = cache;
    var { locationTypeKeys } = message.payload.props;
    
    for (var typeKey of locationTypeKeys) {
        var locationTypeRecord = await (
            db.collection('customRecordType')
            .findOne(
                { collection: 'location', type: typeKey },
                { projection: { events: false }}
            )
        );
        if (!locationTypeRecord) {
            throw new ApiError(400, 'InvalidLocationRecordType');
        }
    }

}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    dispatchProps
}) => {
    var { type: messageType, payload } = message;
    var { id, props } = payload;

    await dispatchProps({
        collection: 'experimentVariantSetting',
        channelId: id,
        props
    });
}

module.exports = handler;
