'use strict';
var MessageTypeRegex = require('./message-type');

var defaultStages = {
    checkSchema: require('./check-schema'),
    checkAllowedAndPlausible: require('./check-allowed-and-plausible'),
    triggerSystemEvents: require('./trigger-system-events'),
    createRecordPropMessages: require('./create-record-prop-messages'),
    
    // no-op
    triggerOtherSideEffects: async () => {},
};

var GenericRecordHandler = ({
    collection,
    op,
    ...customStages
}) => ({
    shouldRun: (message) => {
        return MessageTypeRegex({ collection, op }).test(message.type)
    },
    ...defaultStages,
    ...customStages,
});

for (var key of Object.keys(defaultStages)) {
    var stage = defaultStages[key];
    GenericRecordHandler[key] = stage;
}

module.exports = GenericRecordHandler;
