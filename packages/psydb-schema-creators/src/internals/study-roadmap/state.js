'use strict';
var {
    ClosedObject, DefaultArray,
    Id, ForeignId, StringEnum, SaneString, DateOnlyServerSide
} = require('@mpieva/psydb-schema-fields');

var State = (bag) => {
    var { apiConfig } = bag;

    var schema = ClosedObject({
        'tasks': DefaultArray({
            items: ClosedObject({
                //'_id': Id(), // FIXME: psydb-schema project() required
                'start': DateOnlyServerSide(),
                'end': DateOnlyServerSide(),
                'description': SaneString({ minLength: 1 }),
                'status': StringEnum([ 'finished', 'ongoing', 'planned' ]),
                'assignedTo': ForeignId({ collection: 'personnel' }),
            })
        })
    });
    
    return schema;
}

module.exports = State;
