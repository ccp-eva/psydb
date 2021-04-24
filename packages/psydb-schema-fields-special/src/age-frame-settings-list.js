'use strict';
var AgeFrameSettingsListItem = require('./age-frame-settings-list-item');

var AgeFrameSettingsList = ({
    subjectRecordType,
    subjectRecordTypeScientificFields,
}) => ({
    systemType: 'AgeFrameSettingsList',
    type: 'array',
    default: [],
    items: AgeFrameSettingsListItem({
        subjectRecordType,
        subjectRecordTypeScientificFields,
    })
});

module.exports = AgeFrameSettingsList;
