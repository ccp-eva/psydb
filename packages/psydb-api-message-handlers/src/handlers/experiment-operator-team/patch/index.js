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
    op: 'patch',
    
    triggerSystemEvents: async ({
        db,
        rohrpost,
        personnelId,
        message
    }) => {

        var destructured = destructureMessage({ message });
        var { id, props: { personnelIds }} = destructured;
        
        var recordPropMessages = createRecordPropMessages({
            personnelId,
            props: destructured.props
        });
        
        var { state: { personnelIds: currentPersonnelIds}} = await (
            db.collection('experimentOperatorTeam').findOne({ _id: id })
        );

        if (personnelIds.join('::') !== currentPersonnelIds.join('::')) {
            var teamName = await fetchTeamName({ db, personnelIds });
            recordPropMessages.push({
                type: 'put',
                personnelId,
                payload: { prop: '/state/name', value: teamName }
            });
        }

        var channel = await openChannel({
            db,
            rohrpost,
            ...destructured
        });

        console.dir(recordPropMessages, { depth: null });

        await dispatchRecordPropMessages({
            channel,
            ...destructured,
            recordPropMessages
        });
    }
})

module.exports = handler;
