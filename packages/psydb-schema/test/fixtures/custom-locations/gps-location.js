'use strict';

var GPS = {
    type: 'object',
    properties: {
        latitute: {
            type: 'number',
        },
        longitute: {
            type: 'number',
        },
    },
    required: [
        'latitute',
        'longitude',
    ]
}

module.exports = GPS;
