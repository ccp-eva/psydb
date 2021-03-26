'use strict';
var {
    ExactObject,
    Id,
    EventId,
    ForeignId,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
} = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    return Message({
        type: `study/add-location-type`,
        payload: ExactObject({
            properties: {
                id: Id(),
                lastKnownEventId: EventId(),
                searchType: {
                    type: 'string',
                    enaum: [ 'external', 'inhouse' ]
                },
                customRecordTypeId: ForeignId({
                    collection: 'customRecordType',
                    constraints: {
                        '/collection': 'location'
                    }
                }),
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
                'searchType',
                'customRecordTypeId',
                'enableAllAvailableLocations',
                'enabledLocationIds',
            ]
        })
    });
}

module.exports = Schema;
