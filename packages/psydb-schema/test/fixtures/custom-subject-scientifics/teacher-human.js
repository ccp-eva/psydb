'use strict';
var Teacher = {
    type: 'object',
    properties: {
        teacherCustomProp: { type: 'string' }
    },
    required: [
        'teacherCustomProp',
    ],
}

module.exports = Teacher;
