'use strict';
var ExtBool = () => ({
    systemType: 'ExtBool',
    reactType: 'radio-group',
    type: 'string',
    enum: [
        'yes',
        'no',
        'unknown',
    ]
});

module.exports = ExtBool;
