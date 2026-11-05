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
            key: 'tasks',
            systemType: 'ListOfObjects',
            props: { /* TODO */ },
            pointer: '/state/tasks',
            displayName: 'Tasks',
            displayNameI18N: { de: 'Tasks' },
        },

        //{
        //    key: 'start',
        //    systemType: 'DateOnlyServerSide',
        //    pointer: '/state/start',
        //    displayName: 'Start',
        //    displayNameI18N: { de: 'Beginn' },
        //},
        //{
        //    key: 'end',
        //    systemType: 'DateOnlyServerSide',
        //    pointer: '/state/ende',
        //    displayName: 'End',
        //    displayNameI18N: { de: 'Ende' },
        //},
        //{
        //    key: 'description',
        //    systemType: 'SaneString',
        //    pointer: '/state/description',
        //    displayName: 'Tasks and Milestones',
        //    displayNameI18N: { de: 'Aufgaben und Meilensteine' },
        //},
        //{
        //    key: 'status',
        //    systemType: 'StringEnum',
        //    pointer: '/state/status',
        //    displayName: 'Status',
        //    displayNameI18N: { de: 'Status' },
        //},
        //{
        //    key: 'assignedTo',
        //    systemType: 'ForeignId',
        //    pointer: '/state/assignedTo',
        //    displayName: 'Responsible',
        //    displayNameI18N: { de: 'Verantwortliche:r' },
        //},
    ]), byProp: 'pointer' });

    var meta = {
        collection: 'studyRoadmap',
        isGenericRecord: false,
        hasCustomTypes: false,
        hasSubChannels: false,
        recordLabelDefinition: {
            format: '${#}',
            tokens: [{ systemType: 'Id', dataPointer: '/_id' }]
        },
        availableStaticDisplayFields: Object.values(staticFieldDefinitions),
        staticDisplayFields: [],
    };
    return meta;
}

