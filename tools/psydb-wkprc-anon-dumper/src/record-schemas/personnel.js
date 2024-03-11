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
        'sendMail': DefaultBool({ anonKeep: true }), // XXX

        'gdpr': ClosedObject({
            '_rohrpostMetadata': RohrpostMetadata(),
            'state': ClosedObject({
                'firstname': AnyString({ anonT: 'firstname' }),
                'lastname': AnyString({ anonT: 'lastname' }),
                'description': AnyString({ anonT: 'description' }),

                'emails': DefaultArray({
                    items: ClosedObject({
                        'email': AnyString({ anonT: 'email' }),
                        'isPrimary': DefaultBool({ anonKeep: true })
                    })
                }),
                'phones': DefaultArray({
                    items: AnyString({ anonT: 'phone' }),
                }),
                'internals': ClosedObject({
                    'lastPasswordChange': DateTime({ anonKeep: true })
                }),
            })
        }),
        'scientific': ClosedObject({
            '_rohrpostMetadata': RohrpostMetadata(),
            'state': ClosedObject({
                'canLogIn': DefaultBool({ anonKeep: true }),
                'hasRootAccess': DefaultBool({ anonKeep: true }),
                'researchGroupSettings': DefaultArray({
                    items: ClosedObject({
                        'researchGroupId': MongoFk({
                            collection: 'researchGroup', anonKeep: true
                        }),
                        'systemRoleId': MongoFk({
                            collection: 'systemRole', anonKeep: true
                        }),
                    })
                }),
                'internals': ClosedObject({
                    'forcedResearchGroupId': MongoFk({
                        collection: 'researchGroup', anonKeep: true
                    })
                }),
                'systemPermissions': SystemPermissions(),
            })
        }),
    })

    return schema;
}

module.exports = Schema;
