'use strict';
var {
    MultiChannelRecordMessage
} = require('@mpieva/psydb-schema-helpers');

var internals = require('../');

var SubjectRecordMessage = ({
    op, // create/patch/delete
    subChannelCustomFieldDefinitions,
}) => {
    return MultiChannelRecordMessage({
        op,
        collection: 'subject',
        subChannelCustomFieldDefinitions,
        subChannelStateSchemaCreators: {
            scientific: internals.SubjectScientificState,
            gdpr: internals.SubjectGdprState
        }
    })
}

module.exports = SubjectRecordMessage;
