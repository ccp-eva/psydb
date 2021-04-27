var datefns = require('date-fns');

var gatherAgeFrameDataOfStudy = ({
    studyRecord,
    subjectRecordType,
    timeFrame,
}) => {
    var { conditionsByAgeFrame } = (
        getSubjectSelectionSettingsItem({
            studyRecord,
            subjectRecordType,
        })
    );

    var gathered = [];
    for (var item of conditionsByAgeFrame) {
        var { ageFrame, conditions } = item;

        var timeShifted = {
            // shifting time frame pack by the age frame boundaries
            // ... on the first test day whats the oldest child
            // we can test ? and on the last day of the testing
            // whats the youngest child we can test?
            // ... if we move the testing interval in the past
            // which children are born within the testinterval
            // expanded by the age frame
            start: datefns.sub(timeFrame.start, { days: ageFrame.end }),
            end: datefns.sub(timeFrame.end, { days: ageFrame.start }),
        }

        gathered.push({
            ageFrame,
            timeShifted,
            conditions,
        })
    }

    return gathered;
}

var getSubjectSelectionSettingsItem = ({
    studyRecord,
    subjectRecordType,
}) => {

    var selectionSettingsItem = (
        studyRecord.state.selectionSettingsBySubjectType.find(it => (
            it.subjectRecordType === subjectRecordType
        ))
    )
    
    if (!selectionSettingsItem) {
        throw new Error('subject type is not included in study');
    }

    return selectionSettingsItem;
}

module.exports = gatherAgeFrameDataOfStudy;
