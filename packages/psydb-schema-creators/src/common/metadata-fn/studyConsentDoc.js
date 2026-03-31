'use strict';
var { keyBy } = require('@mpieva/psydb-core-utils');
var { __fixDefinitions } = require('@mpieva/psydb-common-compat');

module.exports = (bag) => {
    var staticFieldDefinitions = keyBy({ items: __fixDefinitions([
        {
            key: '_studyId',
            systemType: 'ForeignId',
            props: { collection: 'study' },
            pointer: '/studyId',
            displayName: 'Study',
            displayNameI18N: { de: 'Studie' },
        },
        {
            key: '_subjectId',
            systemType: 'ForeignId',
            props: { collection: 'subject' },
            pointer: '/studyId',
            displayName: 'Study',
            displayNameI18N: { de: 'Studie' },
        },
        {
            key: '_subjectType',
            systemType: 'SaneString', // FIXME
            pointer: '/subjectType',
            displayName: 'Subject Type',
            displayNameI18N: { de: 'Proband:innen-Typ' },
        },
        {
            key: '_studyConsentForm_internalName',
            systemType: 'SaneString',
            pointer: '/state/studyConsentFormSnapshot/state/internalName',
            displayName: 'Shorthand',
            displayNameI18N: { de: 'Kürzel' },
        },
        {
            key: '_studyConsentForm_title',
            systemType: 'SaneString',
            pointer: '/state/studyConsentFormSnapshot/state/title',
            displayName: 'Title',
            displayNameI18N: { de: 'Titel' },
        },
    ]), byProp: 'pointer' });

    var meta = {
        collection: 'studyConsentDoc',
        isGenericRecord: false,
        hasCustomTypes: false,
        hasSubChannels: false,
        recordLabelDefinition: {
            format: '${#}',
            tokens: [
                {
                    systemType: 'Id',
                    dataPointer: '/_id', // XXX
                },
            ]
        },
        availableStaticDisplayFields: Object.values(staticFieldDefinitions),
        staticDisplayFields: [
            staticFieldDefinitions['/studyId'],
            staticFieldDefinitions[
                '/state/studyConsentFormSnapshot/state/internalName'
            ],
            staticFieldDefinitions[
                '/state/studyConsentFormSnapshot/state/title'
            ],
            staticFieldDefinitions['/subjectType'],
            staticFieldDefinitions['/subjectId'],
        ],
    };
    
    return meta;
}
