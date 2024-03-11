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

        'type': AnyString({ anonKeep: true }),
        'realType': AnyString({ anonKeep: true }),

        'state': ClosedObject({
            'seriesId': MongoId({ anonKeep: true }),

            'color': AnyString({ anonKeep: true }),
            'experimentName': AnyString({ anonT: 'experimentName' }),
            'roomOrEnclosure': AnyString({ anonT: 'roomOrEnclosure' }),
            'generalComment': AnyString({ anonT: 'generalComment' }),
            'isCanceled': DefaultBool({ anonKeep: true }),
            'isPostprocessed': DefaultBool({ anonKeep: true }),

            'interval': ClosedObject({
                'start': DateTime({ anonKeep: true }),
                'end': DateTime({ anonKeep: true }),
            }),

            'studyRecordType': AnyString({ anonKeep: true }),
            'studyId': MongoFk({
                collection: 'study', anonKeep: true
            }),
            'locationRecordType': AnyString({ anonKeep: true }),
            'locationId': MongoFk({
                collection: 'location', anonKeep: true
            }),

            'subjectGroupId': MongoFk({
                collection: 'subjectGroup', anonKeep: true
            }),

            'selectedSubjectGroupIds': DefaultArray({
                items: MongoFk({
                    collection: 'subjectGroup', anonKeep: true
                })
            }),
            'selectedSubjectIds': DefaultArray({
                items: MongoFk({
                    collection: 'subjects', anonKeep: true
                })
            }),

            'experimentOperatorTeamId': MongoFk({
                collection: 'experimentOperatorTeam',
                isNullable: true,
                anonKeep: true
            }),
            'experimentOperatorIds': DefaultArray({
                items: MongoFk({
                    collection: 'personnel', anonKeep: true
                })
            }),

            'subjectData': DefaultArray({
                items: ClosedObject({})
            }),
        })
    })

    return schema;
}

module.exports = Schema;
