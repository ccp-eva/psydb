'use strict';
var BiologicalGender = ({ ...additionalKeywords }) => ({
    systemType: 'BiologicalGender',
    type: 'string',
    enum: [
        'male',
        'female',
        'other',
        'unknown',
    ],
    // FIXME: @rjsf/intl
    enumNames: [
        'Männlich',
        'Weiblich',
        'Divers',
        'Unbekannt',
    ],
    ...additionalKeywords
});

module.exports = BiologicalGender;
