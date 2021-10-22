'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var groupBy = require('@mpieva/psydb-common-lib/src/group-by');
var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

var SimpleHandler = require('../../../../lib/simple-handler'),
    createEvents = require('../../../../lib/create-event-messages-from-props');

var checkForeignIdsExist = require('../../../../lib/check-foreign-ids-exist');
var checkBasics = require('../../utils/check-patch-basics');
var checkCRTFieldPointers = require('../../utils/check-crt-field-pointers');
var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment-variant-setting/online-video-call/patch',
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
    var {
        subjectFieldRequirements,
    } = message.payload.props;
    
    var pointers = subjectFieldRequirements.map(it => it.pointer);
    checkCRTFieldPointers({
        crt: subjectTypeRecord,
        pointers,
    });
}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    personnelId,
}) => {
    var { type: messageType, payload } = message;
    var { id, lastKnownEventId, props } = payload;

    var channel = (
        rohrpost
        .openCollection('experimentVariantSetting')
        .openChannel({ id })
    );

    var messages = createEvents({
        op: 'put',
        personnelId,
        props
    })

    await channel.dispatchMany({ messages, lastKnownEventId });
}

module.exports = handler;
