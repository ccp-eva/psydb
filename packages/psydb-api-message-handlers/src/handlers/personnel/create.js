'use strict';
var GenericRecordHandler = require('../../lib/generic-record-handler');
var {
    destructureMessage,
    openChannel,
    createRecordPropMessages,
    dispatchRecordPropMessages
} = require('../../lib/generic-record-handler-utils');

module.exports = GenericRecordHandler({
    collection: 'personnel',
    op: 'create',
    triggerSystemEvents: async (options) => {
        var { db, rohrpost, personnelId, message } = options;
        var destructured = destructureMessage({ message });

        var channel = openChannel({
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
        })

    },
    triggerOtherSideEffects: async (options) => {}
});
