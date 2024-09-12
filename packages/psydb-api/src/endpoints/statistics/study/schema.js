'use strict';
var {
    MaxObject,
    DefaultArray,
    DateOnlyServerSide,
    LabMethodKey,
    ForeignId,
    AgeFrameBoundary,
    LogicGate,
    ClosedObject,
} = require('@mpieva/psydb-schema-fields');

var Schema = () => {
    var schema = MaxObject({
        'runningPeriodOverlap': MaxObject({
            'start': DateOnlyServerSide({ isNullable: true }),
            'end': DateOnlyServerSide({ isNullable: true }),
        }),
        'labMethodKeys': ClosedObject({
            'logicGate': LogicGate(),
            'values': DefaultArray({
                items: LabMethodKey(),
            })
        }),
        'researchGroupId': ForeignId({
            collection: 'researchGroup', isNullable: true
        }),
        'scientistId': ForeignId({
            collection: 'researchGroup', isNullable: true
        }),
        'ageFrameIntervalOverlap': MaxObject({
            'start': AgeFrameBoundary({ required: [] }),
            'end': AgeFrameBoundary({ required: [] }),
        })
    });
    return schema;
}

module.exports = Schema;
