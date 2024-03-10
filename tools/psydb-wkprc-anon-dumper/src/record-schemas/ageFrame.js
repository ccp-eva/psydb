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
} = require('@mpieva/psydb-anon-dumper-core').schemafields;

var Schema = () => {
    var schema = ClosedObject({
        '_id': MongoId({ anonKeep: true }),
        '_rohrpostMetadata': RohrpostMetadata(),

        'isDummy': DefaultBool({ anonKeep: true }),
        'sequenceNumber': DefaultInt({ anonKeep: true }),
        'studyId': MongoFk({
            collection: 'study', anonKeep: true
        }),
        'subjectSelectorId': MongoFk({
            collection: 'subjectSelector', anonKeep: true
        }),
        'subjectTypeKey': AnyString({
            anonKeep: true
        }),

        'state': ClosedObject({
            'conditions': DefaultArray({
                //items: NullValue({ anonKeep: true }) // XXX
            }, { anonT: 'conditionsArray' }),
            'interval': ClosedObject({
                'start': ClosedObject({
                    'days': DefaultInt({ anonKeep: true }),
                    'months': DefaultInt({ anonKeep: true }),
                    'years': DefaultInt({ anonKeep: true }),
                }),
                'end': ClosedObject({
                    'days': DefaultInt({ anonKeep: true }),
                    'months': DefaultInt({ anonKeep: true }),
                    'years': DefaultInt({ anonKeep: true }),
                }),
            }),
        })
    })

    return schema;
}

module.exports = Schema;
