'use strict';
var BiologicalGender = () => ({
    systemType: 'BiologicalGender',
    type: 'string',
    enum: [
        'male',
        'female',
        'unknown',
    ],
    // FIXME: @rjsf/intl
    enumNames: [
        'Männlich',
        'Weiblich',
        'Unbekannt',
    ]
});

module.exports = BiologicalGender;
