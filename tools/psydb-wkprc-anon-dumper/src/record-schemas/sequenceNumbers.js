'use strict';
var {
    ClosedObject,
    PatternObject,
    DefaultArray,
    RohrpostMetadata,

    MongoId,
    DefaultInt,
} = require('@mpieva/psydb-anon-dumper-core').schemafields;

var Schema = () => {
    var schema = ClosedObject({
        '_id': MongoId({ anonKeep: true }),
        'ageFrame': DefaultInt({ anonKeep: true }),
        'experimentVariant': DefaultInt({ anonKeep: true }),
        'helperSet': DefaultInt({ anonKeep: true }),
        'personnel': DefaultInt({ anonKeep: true }),
        'researchGroup': DefaultInt({ anonKeep: true }),
        'studyTopic': DefaultInt({ anonKeep: true }),
        'subjectSelector': DefaultInt({ anonKeep: true }),
        'systemRole': DefaultInt({ anonKeep: true }),

        'study': PatternObject({
            '^[A-Za-z_]+$': DefaultInt({ anonKeep: true }),
        }),
        'subject': PatternObject({
            '^[A-Za-z_]+$': DefaultInt({ anonKeep: true }),
        }),
        'location': PatternObject({
            '^[A-Za-z_]+$': DefaultInt({ anonKeep: true }),
        }),
        'externalOrganization': PatternObject({
            '^[A-Za-z_]+$': DefaultInt({ anonKeep: true }),
        }),
        'externalPerson': PatternObject({
            '^[A-Za-z_]+$': DefaultInt({ anonKeep: true }),
        }),
    })

    return schema;
}

module.exports = Schema;
