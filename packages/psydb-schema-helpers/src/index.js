'use strict';
module.exports = {
    Message: require('./message'),

    createRecordMessageType: require('./create-record-message-type'),

    CustomTypeRecordCollection: require('./custom-type-record-collection'),
    CustomTypeLabelDefinition: require('./custom-type-label-definition'),

    SingleChannelRecordMessage: require('./single-channel-record-message'),
    MultiChannelRecordMessage: require('./multi-channel-record-message'),

    fieldDefinitionsToSchema: require('./field-definitions-to-schema'),
}
