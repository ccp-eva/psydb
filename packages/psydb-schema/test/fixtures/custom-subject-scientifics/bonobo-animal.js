'use strict';
var Bonobo = {
    type: 'object',
    properties: {
        bonoboCustomProp: { type: 'string' }
    },
    required: [
        'bonoboCustomProp',
    ],
}

module.exports = Bonobo;
