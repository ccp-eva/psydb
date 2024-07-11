'use strict';
var {
    OpenObject,
    DefaultArray,
    Integer,
    SaneString,
    ForeignId,
    ForeignIdList,
} = require('@mpieva/psydb-schema-fields');

var CSVSchema = () => {
    var schema = OpenObject({
        properties: {
            'experimentName': SaneString({ minLength: 1 }),
            'intradaySeqNumber': Integer({ minimum: 0 }),

            'year': Integer({ minimum: 1000 }),
            'month': Integer({ minimum: 0 }),
            'day': Integer({ minimum: 0 }),
            
            'locationId': ForeignId({
                collection: 'location',
                recordType: 'wkprc_ape_location', // XXX
            }),
            'roomOrEnclosure': SaneString({ minLength: 1 }),
            
            'experimentOperatorIds': ForeignIdList({
                collection: 'personnel', minItems: 1,
            }),

            'subjectData': DefaultArray({
                items: OpenObject({
                    properties: {
                        'subjectId': ForeignId({ collection: 'subject' }),
                        'role': SaneString({ minLength: 1 }),
                        'comment': SaneString(),
                    },
                    required: [ 'subjectId', 'role' ]
                }),
                minItems: 1
            }),
            
            'totalSubjectCount': Integer({ minimum: 1 }),
        },
        required: [
            'experimentName',
            'intradaySeqNumber',
            
            'year',
            'month',
            'day',
            
            'locationId',
            'roomOrEnclosure',
            'experimentOperatorIds',
            'subjectData',
            'totalSubjectCount',
        ]
    });

    return schema;
}

module.exports = CSVSchema;
