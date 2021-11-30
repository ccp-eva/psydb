'use strict';
var {
    ExactObject,
    Id,
    EventId,
    ForeignIdList,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
} = require('@mpieva/psydb-schema-helpers');

var Schema = ({ messageType }) => {
    return Message({
        type: messageType,
        payload: ExactObject({
            properties: {
                id: Id(),
                lastKnownEventId: EventId(),
                excludedOtherStudyIds: ForeignIdList({ collection: 'study' })
            },
            required: [
                'id',
                'lastKnownEventId',
                'excludedOtherStudyIds',
            ]
        })
    });
}

module.exports = Schema;
