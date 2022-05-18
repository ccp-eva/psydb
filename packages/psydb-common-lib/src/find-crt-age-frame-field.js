'use strict';
var findCRTAgeFrameField = (crtSettings, options = {}) => {
    var { as } = options;
    var { hasSubChannels, fieldDefinitions } = crtSettings;
    
    var allFieldDefinitions = (
        hasSubChannels
        ? [
            ...fieldDefinitions.scientific || [],
            ...fieldDefinitions.gdpr || [],
        ]
        : fieldDefinitions
    );

    var definition = allFieldDefinitions.find(it => (
        (it.props || {}).isSpecialAgeFrameField
    ));

    switch (as) {
        case 'definition':
            return definition;
        case 'pointer':
        default:
            return definition.pointer;
    }
}

module.exports = findCRTAgeFrameField;
