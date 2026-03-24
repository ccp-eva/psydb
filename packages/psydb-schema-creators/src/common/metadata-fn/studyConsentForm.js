'use strict';
var { keyBy } = require('@mpieva/psydb-core-utils');
var { __compatDefinitions } = require('./__utils');

module.exports = (bag) => {
    var staticFieldDefinitions = keyBy({ items: __compatDefinitions([
        {
            key: '_studyId',
            systemType: 'ForeignId',
            props: {
                collection: 'study',
            },
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
            key: 'internalName',
            systemType: 'SaneString',
            pointer: '/state/internalName',
            displayName: 'Shorthand',
            displayNameI18N: { de: 'Kürzel' },
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

