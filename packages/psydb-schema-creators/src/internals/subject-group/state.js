'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ExactObject,
    SaneString,
    DefaultArray,
    CustomRecordTypeKey,
    ForeignIdList,
} = require('@mpieva/psydb-schema-fields');

var SubjectGroupState = ({} = {}) => {
    var schema = ExactObject({
        properties: {
            name: SaneString({
                title: 'Name',
                minLength: 1
            }),
            subjectsForType: DefaultArray({
                minItems: 1,
                items: ExactObject({
                    properties: {
                        subjectType: CustomRecordTypeKey({
                            collection: 'subject'
                        }),
                        subjectIds: ForeignIdList({
                            collection: 'subject',
                            //recordType: { $data: '1/subjectType' }
                        })
                    },
                    required: [ 'subjectType', 'subjectIds' ]
                })
            })
        },
        required: [
            'name',
            'subjectsForType'
        ]
    })

    return schema;
}

module.exports = SubjectGroupState;
