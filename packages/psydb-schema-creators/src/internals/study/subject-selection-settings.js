'use strict';
var {
    ExactObject,
} = require('@mpieva/psydb-schema-fields');

var ExternalLocationGroupingsItem = (
    require('./external-location-groupings-item')
);

var SubjectSelectConditionsListItem = (
    require('./subject-select-conditions-list-item')
);

var SubjectSelectionSettings = ({
    subjectRecordTypeRecords,
} = {}) => (
    ExactObject({
        systemType: 'SubjectSelectionSettingsList',
        type: 'array',
        default: [],
        items: SubjectSelectConditionsListItem({
            subjectRecordTypeRecords,
        })
    })
);

module.exports = SubjectSelectionSettings;
