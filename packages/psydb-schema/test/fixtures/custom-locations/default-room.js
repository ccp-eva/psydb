'use strict';

var DefaultRoom = {
    type: 'object',
    properties: {
        roomNumber: { type: 'string' },
    },
    required: [
        'roomNumber',
    ],
};

module.exports = DefaultRoom;
