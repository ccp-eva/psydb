'use strict';
var {
    OpenObject,
    DefaultArray,
    Integer,
    SaneString,
    ForeignId,
    ForeignIdList,
} = require('@mpieva/psydb-schema-fields');

var CSVSchema = (bag = {}) => {
    var { locationType } = bag;

    var schema = OpenObject({
        properties: {
            'date': DateYMD(),
            'time': TimeHM(),
            
            'locationId': ForeignId({
                collection: 'location',
                recordType: locationType,
            }),
            
            'experimentOperatorIds': ForeignIdList({
                collection: 'personnel', minItems: 1,
            }),

            'subjectData': DefaultArray({
                items: OpenObject({
                    properties: {
                        'subjectId': ForeignId({ collection: 'subject' }),
                        'comment': SaneString(),
                    },
                    required: [ 'subjectId' ]
                }),
                minItems: 1
            }),
        },
        required: [
            'date',
            'time',
            'locationId',
            'experimentOperatorIds',
            'subjectData',
        ]
    });

    return schema;
}

// TODO: move
var DateYMD = (bag = {}) => {
    var schema = { ...bag, type: 'string', format: 'date' };
    return schema;
}

// TODO: move
var TimeHM = (bag = {}) => {
    var schema = { ...bag, type: 'string', format: 'time-hm' };
    return schema;
}

module.exports = CSVSchema;
