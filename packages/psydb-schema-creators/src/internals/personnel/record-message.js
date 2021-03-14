'use strict';

var {
    MultiChannelRecordMessage
} = require('@mpieva/psydb-schema-helpers');

var internals = require('../');

var PersonnelRecordMessage = ({
    op, // create/patch/delete
}) => {
    return MultiChannelRecordMessage({
        op,
        collection: 'personnel',
        subChannelStateSchemaCreators: {
            scientific: internals.PersonnelScientificState,
            gdpr: internals.PersonnelGdprState
        }
    })
}

module.exports = PersonnelRecordMessage;
