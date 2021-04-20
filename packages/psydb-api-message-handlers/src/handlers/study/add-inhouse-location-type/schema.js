'use strict';
var {
    ExactObject,
    Id,
    EventId,
    ForeignId,
    IdentifierString,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
} = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    return Message({
        type: `study/add-inhouse-location-type`,
        payload: ExactObject({
            properties: {
                id: Id(),
                lastKnownEventId: EventId(),
                customRecordType: IdentifierString(),
                enableAllAvailableLocations: {
                    type: 'boolean',
                    default: false,
                },
                enabledLocationIds: {
                    type: 'array',
                    default: [],
                    items: ForeignId({
                        collection: 'location',
                        constraints: {
                            // FIXME: for the wed need locationType string
                            // instead of customRecordTypeId
                            //'/type': { $data: '1/locationType' }
                        }
                    })
                }
            },
            required: [
                'id',
                'lastKnownEventId',
                'customRecordType',
                'enableAllAvailableLocations',
                'enabledLocationIds',
            ]
        })
    });
}

module.exports = Schema;
