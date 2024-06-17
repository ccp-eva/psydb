'use strict';
var {
    OpenObject,
    DefaultArray,
    Integer,
    SaneString,
    ForeignId,
} = require('@mpieva/psydb-schema-fields');

var CSVSchema = () => {
    var schema = OpenObject({
        properties: {
            'year': Integer({ minimum: 1000 }),
            'month': Integer({ minimum: 0 }),
            'day': Integer({ minimum: 0 }),
            'subjectData': DefaultArray({
                items: OpenObject({
                    properties: {
                        'subjectId': ForeignId({ collection: 'subject' }),
                        'role': SaneString({ minLength: 1 })
                    },
                    required: [ 'subjectId', 'role' ]
                }),
                minItems: 1
            }),
            'experimentName': SaneString({ minLength: 1 }),
            'roomOrEnclosure': SaneString({ minLength: 1 }),
        },
        required: [
            'year',
            'month',
            'day',
            'subjectData',
            'experimentName',
            'roomOrEnclosure',
        ]
    });

    return schema;
}

module.exports = CSVSchema;
