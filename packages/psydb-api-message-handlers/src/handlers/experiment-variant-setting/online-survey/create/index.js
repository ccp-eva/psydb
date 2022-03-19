'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

var SimpleHandler = require('../../../../lib/simple-handler'),
    createEvents = require('../../../../lib/create-event-messages-from-props');

var checkBasics = require('../../utils/check-create-basics');
var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment-variant-setting/online-survey/create',
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
        type: 'online-survey'
    });
}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    personnelId,

    dispatchProps,
}) => {
    var { type: messageType, payload } = message;
    var { id, studyId, experimentVariantId, props } = payload;

    await dispatchProps({
        collection: 'experimentVariantSetting',
        channelId: id,
        isNew: true,
        additionalChannelProps: {
            type: 'online-survey',
            studyId,
            experimentVariantId
        },
        props,

        initialize: true,
        recordType: 'online-survey',
    });
}

module.exports = handler;
