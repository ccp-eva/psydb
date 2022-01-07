'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ExactObject,
    ForeignId,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var StudyTopicState = () => {
    var schema = ExactObject({
        properties: {
            name: SaneString({ title: 'name', minLength: 1 }),
            parentId: ForeignId({
                collection: 'studyTopic',
                isNullable: true
            })
        },
        required: [
            'name',
            'parentId'
        ]
    });

    return schema;
}

module.exports = StudyTopicState;
