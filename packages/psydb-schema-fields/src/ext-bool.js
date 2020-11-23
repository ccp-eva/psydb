'use strict';
var ExtBool = () => ({
    reactType: 'radio-group',
    type: { enum: [
        'yes',
        'no',
        'unknown',
    ]}
});

module.exports = ExtBool;
