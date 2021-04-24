'use strict';
var AgeFrameSettingsListItem = require('./age-frame-settings-list-item');

var AgeFrameSettingsList = ({
    subjectRecordType,
    subjectRecordTypeScientificFields,

    enableCanChangePerSearch = true,
}) => ({
    systemType: 'AgeFrameSettingsList',
    type: 'array',
    default: [],
    items: AgeFrameSettingsListItem({
        subjectRecordType,
        subjectRecordTypeScientificFields,

        enableCanChangePerSearch,
    })
});

module.exports = AgeFrameSettingsList;
