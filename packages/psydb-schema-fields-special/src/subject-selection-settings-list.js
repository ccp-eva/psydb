'use strict';
var {
    ExactObject,
} = require('@mpieva/psydb-schema-fields');

var SubjectSelectionSettingsListItem = (
    require('./subject-selection-settings-list-item')
);

var SubjectSelectionSettingsList = ({
    subjectRecordTypeRecords,
} = {}) => (
    ExactObject({
        systemType: 'SubjectSelectionSettingsList',
        type: 'array',
        default: [],
        items: SubjectSelectionSettingsListItem({
            subjectRecordTypeRecords,
        })
    })
);

module.exports = SubjectSelectionSettingsList;
