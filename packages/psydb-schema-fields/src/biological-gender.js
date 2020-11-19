'use strict';
var BiologicalGender = () => ({
    reactType: 'radio-group',
    type: { enum: [
        'male',
        'female',
        'unknown',
    ]}
});

module.exports = BiologicalGender;
