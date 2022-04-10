'use strict';
var ApiError = require('@mpieva/psydb-api-lib/src/api-error');
var GenericRecordHandler = require('../../../lib/generic-record-handler');

var {
    destructureMessage,
    openChannel,
} = require('../../../lib/generic-record-handler-utils');

var { fetchTeamName } = require('../utils');

var handler = GenericRecordHandler({
    collection: 'experimentOperatorTeam',
    op: 'create',
    
    triggerSystemEvents: async ({
        db,
        rohrpost,
        personnelId,
        message,

        dispatchProps,
    }) => {

        var destructured = destructureMessage({ message });
        var { id, props, additionalCreateProps } = destructured;
        var { personnelIds } = props;

        var teamName = await fetchTeamName({ db, personnelIds });
        props.name = teamName;

        await dispatchProps({
            collection: 'experimentOperatorTeam',
            channelId: id,
            isNew: true,
            additionalChannelProps: additionalCreateProps,
            props,

            initialize: true,
        });
    }
})

module.exports = handler;
