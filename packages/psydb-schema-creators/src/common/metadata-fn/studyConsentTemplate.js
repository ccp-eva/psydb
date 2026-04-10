'use strict';
var { keyBy } = require('@mpieva/psydb-core-utils');
var { __fixDefinitions } = require('@mpieva/psydb-common-compat');

module.exports = (bag) => {
    var staticFieldDefinitions = keyBy({ items: __fixDefinitions([
        {
            key: '_studyType',
            systemType: 'SaneString', // FIXME
            pointer: '/studyType',
            displayName: 'Study Type',
            displayNameI18N: { de: 'Studien-Typ' },
        },
        {
            key: '_subjectType',
            systemType: 'SaneString', // FIXME
            pointer: '/subjectType',
            displayName: 'Subject Type',
            displayNameI18N: { de: 'Proband:innen-Typ' },
        },
        {
            key: 'templateName',
            systemType: 'SaneString',
            pointer: '/state/templateName',
            displayName: 'Template-Shorthand',
            displayNameI18N: { de: 'Template-Kürzel' },
        },
        {
            key: 'title',
            systemType: 'SaneString',
            pointer: '/state/title',
            displayName: 'Title',
            displayNameI18N: { de: 'Titel' },
        },
        {
            key: 'isEnabled',
            systemType: 'DefaultBool',
            pointer: '/state/isEnabled',
            displayName: 'Enabled',
            displayNameI18N: { de: 'Aktiv' },
        },
    ]), byProp: 'pointer' });

    var meta = {
        collection: 'studyConsentForm',
        isGenericRecord: false,
        hasCustomTypes: false,
        hasSubChannels: false,
        recordLabelDefinition: {
            format: '${#}',
            tokens: [
                {
                    systemType: 'SaneString',
                    dataPointer: '/state/internalName',
                },
            ]
        },
        availableStaticDisplayFields: Object.values(staticFieldDefinitions),
        staticDisplayFields: [
            staticFieldDefinitions['/studyId'],
            staticFieldDefinitions['/state/internalName'],
            staticFieldDefinitions['/subjectType'],
            staticFieldDefinitions['/isEnabled'],
        ],
    };
    return meta;
}

