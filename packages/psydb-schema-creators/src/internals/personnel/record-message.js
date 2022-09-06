'use strict';

var {
    MultiChannelRecordMessage
} = require('@mpieva/psydb-schema-helpers');

var internals = require('../');

var PersonnelRecordMessage = ({
    op, // create/patch/delete
    enableCanLogIn,
    enableHasRootAccess,
}) => {
    return MultiChannelRecordMessage({
        op,
        collection: 'personnel',
        extraOptions: {
            enableCanLogIn,
            enableHasRootAccess,
        },
        subChannelStateSchemaCreators: {
            scientific: internals.PersonnelScientificState,
            gdpr: internals.PersonnelGdprState
        }
    })
}

module.exports = PersonnelRecordMessage;
