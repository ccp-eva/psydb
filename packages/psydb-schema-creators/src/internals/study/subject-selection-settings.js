'use strict';
var {
    ExactObject,
} = require('@mpieva/psydb-schema-fields');

var ExternalLocationGroupingsItem = (
    require('./external-location-groupings-item')
);

var SubjectSelectionSettingsItem = (
    require('./subject-selection-settings-item')
);

var SubjectSelectionSettings = ({} = {}) => ExactObject({
    systemType: 'SubjectSelectionSettings',
    externalLocationGroupings: {
        systemType: 'ExternalLocationGroupings',
        type: 'array',
        default: [],
        items: ExternalLocationGroupingsItem()
    },
    subjectTypeSettings: {
        systemType: 'SubjectTypeSettings',
        type: 'array',
        default: [],
        items: SubjectTypeSettingsItem()
    }
});

module.exports = SubjectSelectionSettings;
