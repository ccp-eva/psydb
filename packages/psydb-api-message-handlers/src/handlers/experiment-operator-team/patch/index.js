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
        message,
        dispatchProps,
    }) => {

        var destructured = destructureMessage({ message });
        var { id, props } = destructured;
        var { personnelIds } = props;
        
        var { state: { personnelIds: currentPersonnelIds}} = await (
            db.collection('experimentOperatorTeam').findOne({ _id: id })
        );

        if (personnelIds.join('::') !== currentPersonnelIds.join('::')) {
            var teamName = await fetchTeamName({ db, personnelIds });
            props.name = teamName;
        }

        await dispatchProps({
            collection: 'experimentOperatorTeam',
            channelId: id,
            props,
        });
    }
})

module.exports = handler;
