'use strict';
var {
    destructureMessage,
    openChannel,
    createRecordPropMessages,
    dispatchRecordPropMessages
} = require('../generic-record-handler-utils');

var triggerSystemEvents = async ({
    db,
    rohrpost,
    personnelId,
    message
}) => {
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
    });
}

module.exports = triggerSystemEvents;
