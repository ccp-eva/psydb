'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

var SimpleHandler = require('../../../../lib/simple-handler'),
    createEvents = require('../../../../lib/create-event-messages-from-props');

var checkBasics = require('../../utils/check-create-basics');
var checkCRTFieldPointers = require('../../utils/check-crt-field-pointers');
var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment-variant-setting/online-video-call/create',
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
        type: 'online-video-call'
    });

    var { subjectTypeRecord } = cache;
    var { subjectFieldRequirements } = message.payload.props;
    
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
    var { id, studyId, experimentVariantId, props } = payload;

    var channel = (
        rohrpost
        .openCollection('experimentVariantSetting')
        .openChannel({
            id,
            isNew: true,
            additionalChannelProps: {
                type: 'online-video-call',
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

    /*var messages = PutMaker({ personnelId }).all({
        '/state/subjectTypeKey': props.subjectTypeKey,
    });*/

    await channel.dispatchMany({ messages });
}

module.exports = handler;
