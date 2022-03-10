'use strict';
var ApiError = require('@mpieva/psydb-api-lib/src/api-error');
var GenericRecordHandler = require('../../../lib/generic-record-handler');

var {
    destructureMessage,
    openChannel,
    createRecordPropMessages,
    dispatchRecordPropMessages
} = require('../../../lib/generic-record-handler-utils');

var { fetchTeamName } = require('../utils');

var handler = GenericRecordHandler({
    collection: 'experimentOperatorTeam',
    op: 'create',
    
    triggerSystemEvents: async ({
        db,
        rohrpost,
        personnelId,
        message
    }) => {

        var destructured = destructureMessage({ message });
        var { props: { personnelIds }} = destructured;

        var teamName = await fetchTeamName({ db, personnelIds });

        var channel = await openChannel({
            db,
            rohrpost,
            ...destructured
        });

        var recordPropMessages = createRecordPropMessages({
            personnelId,
            props: destructured.props
        });
        
        recordPropMessages.push({
            type: 'put',
            personnelId,
            payload: { prop: '/state/name', value: teamName }
        });

        await dispatchRecordPropMessages({
            channel,
            ...destructured,
            recordPropMessages
        });
    }
})

module.exports = handler;
