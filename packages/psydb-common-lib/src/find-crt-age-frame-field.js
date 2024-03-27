'use strict';
var CRTSettings = require('./crt-settings');

var findCRTAgeFrameField = (crtSettings, options = {}) => {
    var { as } = options;
    
    var crt = (
        crtSettings.getRaw
        ? crtSettings 
        : CRTSettings({ data: crtSettings })
    );

    var [ definition ] = crt.findCustomFields({
        'props.isSpecialAgeFrameField': true
    });

    if (!definition) {
        return undefined;
    }

    switch (as) {
        case 'definition':
            return definition;
        case 'pointer':
        default:
            return definition.pointer;
    }
}

module.exports = findCRTAgeFrameField;
