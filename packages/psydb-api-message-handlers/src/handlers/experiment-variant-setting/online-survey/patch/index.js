'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { SimpleHandler } = require('../../../../lib');

var checkBasics = require('../../utils/check-patch-basics');
var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment-variant-setting/online-survey/patch',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    cache,
    message,
}) => {
    await checkBasics({
        db,
        permissions,
        cache,
        message,
    });
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
