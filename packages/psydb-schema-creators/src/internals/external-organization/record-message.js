'use strict';
var {
    SingleChannelRecordMessage
} = require('@mpieva/psydb-schema-helpers');

var internals = require('../');

var ExternalOrganizationRecordMessage = ({
    op, // create/patch/delete
    type,
    customFieldDefinitions,
}) => {
    return SingleChannelRecordMessage({
        op,
        collection: 'externalOrganization',
        type,
        customFieldDefinitions,
        stateSchemaCreator: internals.ExternalOrganizationState
    })
}

module.exports = ExternalOrganizationRecordMessage;
