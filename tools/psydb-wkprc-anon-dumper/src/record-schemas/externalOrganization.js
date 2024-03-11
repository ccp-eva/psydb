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

        'studyId': MongoFk({ collection: 'study', anonKeep: true }),
        'experimentVariantId': MongoFk({
            collection: 'study', anonKeep: true
        }),

        'state': ClosedObject({
            'custom': ClosedObject({
                'address': Address(),
                'shorthand': AnyString({ anonT: 'shorthand' }),
                'name': AnyString({ anonT: 'name' }),
                'contactPerson': AnyString({ anonT: 'contactPerson' }),
                'description': AnyString({ anonT: 'description' }),
                
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

            'systemPermissions': SystemPermissions(),
        })
    })

    return schema;
}

module.exports = Schema;
