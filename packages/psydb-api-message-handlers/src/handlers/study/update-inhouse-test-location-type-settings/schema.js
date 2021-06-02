'use strict';
var {
    ExactObject,
    DefaultBool,
    Id,
    EventId,
    ForeignIdList,
    IdentifierString,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
} = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    return Message({
        type: `study/update-inhouse-test-location-type-settings`,
        payload: ExactObject({
            properties: {
                id: Id(),
                lastKnownEventId: EventId(),
                customRecordType: IdentifierString(),
                props: ExactObject({
                    properties: {
                        enabledLocationIds: ForeignIdList({
                            collection: 'location',
                            // recordType: { $data: '2/customRecordType' }
                        })
                    },
                    required: [
                        'enabledLocationIds'
                    ]
                })
            },
            required: [
                'id',
                'lastKnownEventId',
                'customRecordType',
                'props',
            ]
        })
    });
}

module.exports = Schema;
