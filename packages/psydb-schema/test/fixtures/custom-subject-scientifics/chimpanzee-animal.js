'use strict';
var Chimpanzee = {
    type: 'object',
    properties: {
        chimpanzeeCustomProp: { type: 'string' }
    },
    required: [
        'chimpanzeeCustomProp',
    ],
}

module.exports = Chimpanzee;
