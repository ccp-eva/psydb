'use strict';
var MessageTypeRegex = require('./message-type'),
    checkSchema = require('./check-schema'),
    checkAllowedAndPlausible = require('./check-allowed-and-plausible'),
    triggerSystemEvents = require('./trigger-system-events'),
    createRecordPropMessages = require('./create-record-prop-messages');

var GenericRecordHandler = ({ op }) => ({
    shouldRun: (message) => {
        return MessageTypeRegex(op).test(message.type)
    },
    
    checkSchema,
    checkAllowedAndPlausible,
    triggerSystemEvents,
    
    // no-op
    triggerOtherSideEffects: async () => {},
});

module.exports = GenericRecordHandler;
