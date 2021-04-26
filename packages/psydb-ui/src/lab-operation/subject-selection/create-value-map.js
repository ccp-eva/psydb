const createValueMap = (studySelectionSettings) => {
    var mapping = {};
    for (var study of studySelectionSettings) {
        var { studyId } = study;
        for (var af of study.selectionSettingsBySubjectType.conditionsByAgeFrame) {
            var ageFrameKey = (
                `/${studyId}/conditionsByAgeFrame/${af.ageFrame.start}_${af.ageFrame.end}`
            );
            mapping[ageFrameKey] = {};


            for (var condition of af.conditions) {
                var condKey = condition.fieldKey;

                for (var [index, value] of condition.values.entries()) {

                    var valueKey = `/conditions/${condKey}/value_${index}`
                    mapping[ageFrameKey][valueKey] = value;
                }
            }
        }
    }
    return mapping;
}
export default createValueMap
