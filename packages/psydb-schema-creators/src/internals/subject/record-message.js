'use strict';
var {
    MultiChannelRecordMessage
} = require('@mpieva/psydb-schema-helpers');

var internals = require('../');

var SubjectRecordMessage = ({
    op, // create/patch/delete
    type,
    subChannelCustomFieldDefinitions,
}) => {
    var schema = MultiChannelRecordMessage({
        op,
        collection: 'subject',
        type,
        subChannelCustomFieldDefinitions,
        subChannelStateSchemaCreators: {
            scientific: internals.SubjectScientificState,
            gdpr: internals.SubjectGdprState
        }
    });
    // FIXME: this is only for migrating existing onlineIds
    // and can probably removed in the future
    // if its kept we need to restrict this to nanoid specifically
    schema.properties.payload.properties.onlineId = { type: 'string' };
    return schema;
}

module.exports = SubjectRecordMessage;
