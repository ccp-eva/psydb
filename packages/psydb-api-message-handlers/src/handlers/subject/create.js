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
        var { db, rohrpost, personnelId, message, cache, dispatchProps } = options;
        var destructured = destructureMessage({ message });
        var {
            collection,
            recordType,
            props,
            additionalCreateProps
        } = destructured;

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
    
        await dispatchProps({
            collection,
            channel,
            recordType,
            subChannelKey: 'gdpr',
            props: props.gdpr,
            initialize: true,
        });

        await dispatchProps({
            collection,
            channel,
            recordType,
            subChannelKey: 'scientific',
            props: props.scientific,
            initialize: true,
        });
    },
});
