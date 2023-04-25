'use strict';
var { ExactObject, Id, EventId } = require('@mpieva/psydb-schema-fields');
var { Message } = require('@mpieva/psydb-schema-helpers');
var { apiKey } = require('@mpieva/psydb-schema-creators');

var Schema = () => {
    return Message({
        type: 'apiKey/patch',
        payload: ExactObject({
            properties: {
                id: Id(),
                lastKnownEventId: EventId(),
                props: apiKey.State()
            },
            required: [ 'id', 'props' ]
        })
    });
}

module.exports = Schema;
