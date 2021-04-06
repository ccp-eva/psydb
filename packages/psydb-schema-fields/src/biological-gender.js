'use strict';
var BiologicalGender = () => ({
    systemType: 'BiologicalGender',
    reactType: 'radio-group',
    type: { enum: [
        'male',
        'female',
        'unknown',
    ]}
});

module.exports = BiologicalGender;
