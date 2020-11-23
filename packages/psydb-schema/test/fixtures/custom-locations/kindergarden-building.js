'use strict';
var Kindergarden = {
    type: 'object',
    properties: {
        kindergardenCustomProp: { type: 'string' }
    },
    required: [
        'kindergardenCustomProp',
    ],
}

module.exports = Kindergarden;
