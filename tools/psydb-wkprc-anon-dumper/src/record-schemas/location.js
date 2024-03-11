'use strict';
var {
    ClosedObject,
    DefaultArray,
    RohrpostMetadata,

    MongoId,
    MongoFk,
    DateTime,
    DefaultBool,
    DefaultInt,
    AnyString,
    NullValue,
    
    Address,
    SystemPermissions
} = require('@mpieva/psydb-anon-dumper-core').schemafields;

var Schema = () => {
    var schema = ClosedObject({
        '_id': MongoId({ anonKeep: true }),
        '_rohrpostMetadata': RohrpostMetadata(),

        'sequenceNumber': DefaultInt(),
        'isDummy': DefaultBool({ anonKeep: true }),
        'type': AnyString({ anonKeep: true }),

        'state': ClosedObject({
            'custom': ClosedObject({
                'address': Address(),
                'name': AnyString({ anonT: 'name' }),
                'head': AnyString({ anonT: 'head' }),
                'vice': AnyString({ anonT: 'vice' }),
                'number': AnyString({ anonT: 'number' }),
                'roomName': AnyString({ anonT: 'roomName' }),

                'supervisorId': MongoFk({
                    collection: 'personnel', anonKeep: true 
                }),
                'kigaUmbrellaOrgId': MongoFk({
                    collection: 'externalOrganization', anonKeep: true 
                }),

                'emails': DefaultArray({
                    items: AnyString({ anonT: 'emails' })
                }),
                'faxes': DefaultArray({
                    items: AnyString({ anonT: 'faxes' })
                }),
                'phones': DefaultArray({
                    items: AnyString({ anonT: 'phones' })
                }),
            }),

            'reservationSettings': ClosedObject({
                'canBeReserved': DefaultBool({ anonKeep: true }),
                'reservationSlotDuration': DefaultInt({ anonKeep: true }),
                'excludedExperimentWeekdays': ClosedObject({
                    'mon': DefaultBool({ anonKeep: true }),
                    'tue': DefaultBool({ anonKeep: true }),
                    'wed': DefaultBool({ anonKeep: true }),
                    'thu': DefaultBool({ anonKeep: true }),
                    'fri': DefaultBool({ anonKeep: true }),
                    'sat': DefaultBool({ anonKeep: true }),
                    'sun': DefaultBool({ anonKeep: true }),
                }),
                'possibleReservationTimeInterval': ClosedObject({
                    'start': DateTime({ anonKeep: true }),
                    'end': DateTime({ anonKeep: true }),
                }),
                'possibleReservationWeekdays': ClosedObject({
                    'mon': DefaultBool({ anonKeep: true }),
                    'tue': DefaultBool({ anonKeep: true }),
                    'wed': DefaultBool({ anonKeep: true }),
                    'thu': DefaultBool({ anonKeep: true }),
                    'fri': DefaultBool({ anonKeep: true }),
                    'sat': DefaultBool({ anonKeep: true }),
                    'sun': DefaultBool({ anonKeep: true }),
                }),
                'timezone': AnyString({ anonKeep: true }),
            }),
            'internals': ClosedObject({}, { anonT: 'internals' }),
            'comment': AnyString({ anonT: 'comment' }),
            'systemPermissions': SystemPermissions(),
        })
    })

    return schema;
}

module.exports = Schema;
