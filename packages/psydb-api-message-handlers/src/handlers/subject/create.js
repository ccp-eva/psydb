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

        var { additionalCreateProps } = destructured;
        if (!additionalCreateProps.onlineId) {
            additionalCreateProps.onlineId = nanoid.customAlphabet(
                [
                    '123456789',
                    'abcdefghikmnopqrstuvwxyz',
                    'ABCDEFGHJKLMNPQRSTUVWXYZ'
                ].join(''), 8
            )();
        }

        var channel = await openChannel({
            db,
            rohrpost,
            ...destructured
        });
    
        var recordPropMessages = createRecordPropMessages({
            personnelId,
            props: destructured.props
        });

        await dispatchRecordPropMessages({
            channel,
            ...destructured,
            recordPropMessages
        });
    },
});
