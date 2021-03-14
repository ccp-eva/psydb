'use strict';
var {
    SingleChannelRecordMessage
} = require('@mpieva/psydb-schema-helpers');

var internals = require('../');

var SystemRoleRecordMessage = ({
    op, // create/patch/delete
}) => {
    return SingleChannelRecordMessage({
        op,
        collection: 'systemRole',
        stateSchemaCreator: internals.SystemRoleState
    })
}

module.exports = SystemRoleRecordMessage;
