'use strict';
var {
    ApiError,
    validateOrThrow,
} = require('@mpieva/psydb-api-lib');
var { GenericRecordHandler } = require('../../../lib');

var {
    destructureMessage,
    openChannel,
    createRecordPropMessages,
    dispatchRecordPropMessages
} = require('../../../lib/generic-record-handler-utils');

var { fetchTeamName } = require('../utils');

var Schema = require('./schema');

var handler = GenericRecordHandler({
    collection: 'experimentOperatorTeam',
    op: 'patch',

    checkSchema: async (context) => {
        var { db, message, cache } = context;
        var type = 'experimentOperatorTeam/patch';

        var core = Schema.Core({ messageType: type });
        validateOrThrow({
            payload: message,
            schema: core
        });

        var { id } = message.payload;
        var experimentCount = await (
            db.collection('experiment')
            .countDocuments({ 'state.experimentOperatorTeamId': id })
        );

        var full = Schema.Full({
            messageType: type,
            hasExperiments: experimentCount > 0
        });
        validateOrThrow({
            payload: message,
            schema: full
        });
    },
    
    triggerSystemEvents: async (context) => {
        var {
            db,
            message,
            cache,
            dispatchProps,
        } = context;

        var destructured = destructureMessage({ message });
        var { id, props } = destructured;

        var { personnelIds } = props;
        if (personnelIds) {
            var { state: { personnelIds: currentPersonnelIds}} = await (
                db.collection('experimentOperatorTeam').findOne({ _id: id })
            );

            if (personnelIds.join('::') !== currentPersonnelIds.join('::')) {
                var teamName = await fetchTeamName({ db, personnelIds });
                props.name = teamName;
            }
        }

        await dispatchProps({
            collection: 'experimentOperatorTeam',
            channelId: id,
            props,
        });
    }
})

module.exports = handler;
