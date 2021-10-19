'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var groupBy = require('@mpieva/psydb-common-lib/src/group-by');
var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

var SimpleHandler = require('../../../../lib/simple-handler'),
    createEvents = require('../../../../lib/create-event-messages-from-props');

var checkForeignIdsExist = require('../../../../lib/check-foreign-ids-exist');
var checkBasics = require('../../utils/check-create-basics');
var checkCRTFieldPointers = require('../../utils/check-crt-field-pointers');
var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment-variant-setting/away-team/create',
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
        type: 'away-team'
    });

    var { subjectTypeRecord } = cache;
    var {
        subjectLocationFieldPointer,
    } = message.payload.props;
    
    checkCRTFieldPointers({
        crt: subjectTypeRecord,
        pointers: [ subjectLocationFieldPointer ]
    });

}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    personnelId,
}) => {
    var { type: messageType, payload } = message;
    var { id, studyId, experimentVariantId, props } = payload;

    var channel = (
        rohrpost
        .openCollection('experimentVariantSetting')
        .openChannel({
            id,
            isNew: true,
            additionalChannelProps: {
                type: 'away-team',
                studyId,
                experimentVariantId
            }
        })
    );

    var messages = createEvents({
        op: 'put',
        personnelId,
        props
    })

    await channel.dispatchMany({ messages });
}

module.exports = handler;
