'use strict';
var School = {
    type: 'object',
    properties: {
        schoolCustomProp: { type: 'string' }
    },
    required: [
        'schoolCustomProp',
    ],
}

module.exports = School;
