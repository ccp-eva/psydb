'use strict';
var nanoid = require('nanoid');

var GenericRecordHandler = require('../../lib/generic-record-handler');
var {
    destructureMessage,
    openChannel,
    createRecordPropMessages,
    dispatchRecordPropMessages
} = require('../../lib/generic-record-handler-utils');

module.exports = GenericRecordHandler({
    collection: 'subject',
    op: 'create',
    triggerSystemEvents: async (options) => {
        var { db, rohrpost, personnelId, message, cache } = options;
        var destructured = destructureMessage({ message });

        var channel = await openChannel({
            db,
            rohrpost,
            ...destructured
        });
    
        var recordPropMessages = createRecordPropMessages({
            personnelId,
            props: destructured.props
        });

        var onlineId = destructured.onlineId || nanoid.customAlphabet(
            [
                '123456789',
                'abcdefghikmnopqrstuvwxyz',
                'ABCDEFGHJKLMNPQRSTUVWXYZ'
            ].join(''), 8
        )();

        recordPropMessages.push({
            type: 'put',
            personnelId,
            subChannelKey: 'scientific',
            payload: {
                prop: '/state/internals/onlineId',
                value: onlineId
            }
        });

        await dispatchRecordPropMessages({
            channel,
            ...destructured,
            recordPropMessages
        });
    },
});
