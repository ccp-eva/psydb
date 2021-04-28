'use strict';
var ExtBool = ({
    ...additionalKeywords
}) => ({
    systemType: 'ExtBool',
    type: 'string',
    enum: [
        'yes',
        'no',
        'unknown',
    ],
    // FIXME: this is rjsf
    enumNames: [
        'Ja',
        'Nein',
        'Unbekannt',
    ],
    ...additionalKeywords,
});

module.exports = ExtBool;
