'use strict';
var {
    MultiChannelRecordMessage
} = require('@mpieva/psydb-schema-helpers');

var internals = require('../');

var SubjectRecordMessage = ({
    op, // create/patch/delete
    type,
    subChannelCustomFieldDefinitions,
    additionalSchemaCreatorArgs,
    extraOptions,
}) => {
    var schema = MultiChannelRecordMessage({
        op,
        collection: 'subject',
        type,
        subChannelCustomFieldDefinitions,
        additionalSchemaCreatorArgs,
        subChannelStateSchemaCreators: {
            scientific: internals.SubjectScientificState,
            gdpr: internals.SubjectGdprState
        },
        extraOptions,
    });
    // FIXME: this is only for migrating existing onlineIds
    // and can probably removed in the future
    // if its kept we need to restrict this to nanoid specifically
    schema.properties.payload.properties.onlineId = { type: 'string' };
    
    // XXX
    schema.properties.payload.properties.forceDuplicate = { type: 'boolean', default: false };
    // XXX
    schema.properties.payload.properties.setIsHidden = { type: 'boolean', default: false };

    return schema;
}

module.exports = SubjectRecordMessage;
