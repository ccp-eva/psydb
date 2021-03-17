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
    return MultiChannelRecordMessage({
        op,
        collection: 'subject',
        type,
        subChannelCustomFieldDefinitions,
        subChannelStateSchemaCreators: {
            scientific: internals.SubjectScientificState,
            gdpr: internals.SubjectGdprState
        }
    })
}

module.exports = SubjectRecordMessage;
