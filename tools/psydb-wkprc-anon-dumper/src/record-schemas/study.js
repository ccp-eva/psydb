'use strict';
var {
    ClosedObject,
    DefaultArray,
    RohrpostMetadata,

    MongoId,
    MongoFk,
    MongoFkList,
    DateTime,
    DefaultBool,
    DefaultInt,
    AnyString,
    AnyStringList,
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
                'description': AnyString({ anonT: 'description' }),
                'doi': AnyString({ anonT: 'doi' }),
                'equipmentLocation': AnyString({
                    anonT: 'equipmentLocation'
                }),
                'equipmentLinks': AnyStringList({ items: {
                    anonT: 'equipmentLink'
                }}),

                'assistents': MongoFkList({ items: {
                    collection: 'personnel', anonKeep: true
                }}),
                'experimenterIds': MongoFkList({ items: {
                    collection: 'personnel', anonKeep: true
                }}),
                // XXX: typo
                'herlperPersonIds': MongoFkList({ items: {
                    collection: 'personnel', anonKeep: true
                }}),
                'novels': MongoFkList({ items: {
                    collection: 'helperSet', anonKeep: true
                }}),

            }),

            'isCreateFinalized': DefaultBool({ anonKeep: true }),
            'name': AnyString({ anonT: 'name' }),
            'shorthand': AnyString({ anonT: 'shorthand' }),

            'enableFollowUpExperiments': DefaultBool({ anonKeep: true }),

            'studyTopicIds': MongoFkList({ items: {
                collection: 'studyTopic', anonKeep: true
            }}),
            'excludedOtherStudyIds': MongoFkList({ items: {
                collection: 'study', anonKeep: true
            }}),
            'scientistIds': MongoFkList({ items: {
                collection: 'personnel', anonKeep: true
            }}),
            'researchGroupIds': MongoFkList({ items: {
                collection: 'researchGroup', anonKeep: true
            }}),

            'runningPeriod': ClosedObject({
                'start': DateTime({ anonKeep: true }),
                'end': DateTime({ anonKeep: true, isNullable: true }),
            }),

            // XXX: probably outdated
            'inhouseTestLocationSettings': DefaultArray({
                anonT: 'inhouseTestLocationSettings'
            }),
            'systemPermissions': SystemPermissions(),
        })
    })

    return schema;
}

module.exports = Schema;
