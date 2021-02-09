'use strict';
module.exports = {
    HelperSetState: require('./helper-set/state'),
    HelperSetItemState: require('./helper-set-item/state'),

    PersonnelScientificState: require('./personnel/scientific-state'),
    PersonnelGdprState: require('./personnel/gdpr-state'),
    
    SubjectScientificState: require('./subject/scientific-state'),
    SbjectGdprState: require('./subject/gdpr-state'),
    
    LocationState: require('./location/generic-location-state'),
    SystemRoleState: require('./system-role/state'),
}
