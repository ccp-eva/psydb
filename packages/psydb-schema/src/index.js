'use strict';
module.exports = {
    createAllSchemas: require('./create-all/'),

    PersonnelScientificState: require('./collection/personnel/scientific-state'),
    PersonnelGdprState: require('./collection/personnel/gdpr-state'),
    
    SubjectScientificState: require('./collection/subject/scientific-state'),
    SbjectGdprState: require('./collection/subject/gdpr-state'),
    
    LocationState: require('./collection/location/generic-location-state'),
    SystemRoleState: require('./collection/system-role/state'),
};
