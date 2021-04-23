'use strict';
var {
    ExactObject,
} = require('@mpieva/psydb-schema-fields');

var ExternalLocationGroupingsItem = (
    require('./external-location-groupings-item')
);

var SubjectTypeSettingsItem = (
    require('./subject-type-settings-item')
);

var SubjectSelectionSettings = ({
    subjectRecordTypeRecords,
} = {}) => (
    ExactObject({
        systemType: 'SubjectSelectionSettings',
        externalLocationGroupings: {
            systemType: 'ExternalLocationGroupings',
            type: 'array',
            default: [],
            items: ExternalLocationGroupingsItem({
                subjectRecordTypeRecords,
            })
        },
        /*subjectTypeSettings: {
            systemType: 'SubjectTypeSettings',
            type: 'array',
            default: [],
            items: SubjectTypeSettingsItem({
                subjectRecordTypeRecords,
            })
        }*/
    })
);

module.exports = SubjectSelectionSettings;
