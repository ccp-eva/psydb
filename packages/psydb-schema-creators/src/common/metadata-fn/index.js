'use strict';
module.exports = (bag) => {
    var { apiConfig } = bag;

    var collections = [
        'customRecordType',
        'helperSet',
        'helperSetItem',
        
        'personnel',
        'researchGroup',
        'systemRole',
        'apiKey',

        'location',
        'study',
        'subject',
        'externalOrganization',
        'externalPerson',

        'subjectGroup',
        'studyTopic',

        'ageFrame',
        'subjectSelector',
        'experimentVariant',
        'experimentVariantSetting',
        'experimentOperatorTeam',
        'reservation',
        'experiment',

        'studyConsentForm',
        'studyConsentDoc',
    ];

    var out = {};
    for (var it of collections) {
        out[it] = require(`./${it}.js`)({ apiConfig });
    }
    return out;
}
