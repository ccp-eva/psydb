'use strict';
var BiologicalGender = ({ ...additionalKeywords }) => ({
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
    ],
    ...additionalKeywords
});

module.exports = BiologicalGender;
