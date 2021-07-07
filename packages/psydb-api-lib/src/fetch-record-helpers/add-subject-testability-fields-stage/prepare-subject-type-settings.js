'use strict';

var prepareSubjectTypeSettings = ({
    studyRecords,
    subjectType,
}) => {
    var subjectTypeSettingsByStudy = {};
    for (var study of studyRecords) {
        var subjectTypeSettingsItem = (
            study.state.selectionSettingsBySubjectType.find(it => (
                it.subjectRecordType === subjectType
            ))
        )
        
        if (!subjectTypeSettingsItem) {
            throw new Error('subject type is not included in study');
        }

        subjectTypeSettingsByStudy[study._id] = subjectTypeSettingsItem;
    }
    
    return subjectTypeSettingsByStudy;
}

module.exports = prepareSubjectTypeSettings;
