'use strict';
var Child = {
    type: 'object',
    properties: {
        childCustomProp: { type: 'string' }
    },
    required: [
        'childCustomProp',
    ],
}

module.exports = Child;
