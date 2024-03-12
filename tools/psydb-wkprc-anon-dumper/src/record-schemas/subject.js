'use strict';
var {
    ClosedObject,
    DefaultArray,
    RohrpostMetadata,

    MongoId,
    DateTime,
    DefaultBool,
    DefaultInt,
    MongoFk,
    AnyString,

    SystemPermissions,
} = require('@mpieva/psydb-anon-dumper-core').schemafields;

var Schema = () => {
    var schema = ClosedObject({
        '_id': MongoId({ anonKeep: true }),
        '_rohrpostMetadata': RohrpostMetadata(),

        'sequenceNumber': DefaultInt(),
        'isDummy': DefaultBool({ anonKeep: true }),
        'type': AnyString({ anonKeep: true }),

        'gdpr': ClosedObject({
            '_rohrpostMetadata': RohrpostMetadata(),
            'state': ClosedObject({
                'custom': ClosedObject({}, { anonT: 'gdpr.state.custom' })
            })
        }),
        'scientific': ClosedObject({
            '_rohrpostMetadata': RohrpostMetadata(),
            'state': ClosedObject({
                'custom': ClosedObject({
                    'wkprcIdCode': AnyString({ anonT: 'wkprcIdCode' }),
                    'name': AnyString({ anonT: 'name' }),
                    'arrivalDate': DateTime({ anonT: 'arrivalDate' }),
                    'arrivedFrom': AnyString({ anonT: 'arrivedFrom' }),
                    'biologicalGender': AnyString({ anonKeep: true }),
                    'dateOfBirth': AnyString({
                        anonKeep: true, isNullable: true
                    }),
                    
                    'originId': MongoFk({ // FIXME
                        collection: 'helperSet', anonKeep: true,
                        isNullable: true,
                    }),
                    'rearingHistoryId': MongoFk({ // FIXME
                        collection: 'helperSet', anonKeep: true,
                        isNullable: true,
                    }),
                    'rearingHistoryId': MongoFk({ // FIXME
                        collection: 'helperSet', anonKeep: true,
                        isNullable: true,
                    }),
                    'subSpeciesId': MongoFk({ // FIXME
                        collection: 'helperSet', anonKeep: true,
                        isNullable: true,
                    }),

                    'fatherId': MongoFk({
                        collection: 'subject', anonKeep: true,
                        isNullable: true,
                    }),
                    'motherId': MongoFk({
                        collection: 'subject', anonKeep: true,
                        isNullable: true,
                    }),
                    'groupId': MongoFk({
                        collection: 'subjectGroup', anonKeep: true,
                    }),
                    'locationId': MongoFk({
                        collection: 'location', anonKeep: true,
                    }),
                }),
                'internals': ClosedObject({
                    'invitedForExperiments': DefaultArray({
                        anonT: 'invitedForExperiments', // XXX
                    }),
                    'participatedInStudies': DefaultArray({
                        anonT: 'participatedInStudies' // XXX
                    }),
                    'isRemoved': DefaultBool({ anonKeep: true }),
                }),
                'comment': AnyString({ anonT: 'comment' }),
                'testingPermissions': DefaultArray({
                    anonT: 'testingPermissions', // XXX
                }),
                'systemPermissions': SystemPermissions(),
            }),
        })
    })

    return schema;
}

module.exports = Schema;
