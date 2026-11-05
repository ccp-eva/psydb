'use strict';
var { keyBy } = require('@mpieva/psydb-core-utils');
var { __fixDefinitions } = require('@mpieva/psydb-common-compat');

module.exports = (bag) => {
    var staticFieldDefinitions = keyBy({ items: __fixDefinitions([
        {
            key: '_studyId',
            systemType: 'ForeignId', // FIXME
            pointer: '/studyId',
            displayName: 'Study',
            displayNameI18N: { de: 'Studie' },
            props: { collection: 'study' }
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
            key: 'mailSubject',
            systemType: 'SaneString',
            pointer: '/state/mailSubject',
            displayName: 'Betreff',
            displayNameI18N: { de: 'Subject Line' },
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
        collection: 'studyEmailTemplate',
        isGenericRecord: false,
        hasCustomTypes: false,
        hasSubChannels: false,
        recordLabelDefinition: {
            format: '${#}',
            tokens: [
                {
                    systemType: 'SaneString',
                    dataPointer: '/state/tenmplateName',
                },
            ]
        },
        availableStaticDisplayFields: Object.values(staticFieldDefinitions),
        staticDisplayFields: [
            staticFieldDefinitions['/studyId'],
            staticFieldDefinitions['/state/tenmplateName'],
            staticFieldDefinitions['/subjectType'],
            staticFieldDefinitions['/isEnabled'],
        ],
    };
    return meta;
}

