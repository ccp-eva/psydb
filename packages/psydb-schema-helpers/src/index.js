'use strict';
module.exports = {
    Message: require('./message'),

    createRecordMessageType: require('./create-record-message-type'),
    RecordIdOnlyMessage: require('./record-id-only-message'),
    RecordPropsMessage: require('./record-props-message'),

    CustomTypeRecordCollection: require('./custom-type-record-collection'),
    CustomTypeLabelDefinition: require('./custom-type-label-definition'),
    CustomTypeFieldList: require('./custom-type-field-list'),

    SingleChannelrecordMesage: require('./single-channel-record-message'),
    MultiChannelRecordMessage: require('./multi-channel-record-message'),

    fieldDefinitionsToSchema: require('./field-definitions-to-schema'),
}
