'use strict';
var filterAgeFrameConditions = ({
    studyId,
    enabledAgeFrames,
    enabledValues,
    conditionsByAgeFrameList,
}) => {

    var enabledStudyAgeFrames = (
        enabledAgeFrames
        .filter(it => it.startsWith(`/${studyId}/`))
        .map(it => it.replace(`/${studyId}/`, ''))
    );

    var filteredConditionsByAgeFrame = [];
    for (var cbaf of conditionsByAgeFrameList) {
        var { start, end } = cbaf.ageFrame;
        var cbafEnabled = (
            enabledStudyAgeFrames.includes(`${start}_${end}`)
        )
        if (cbafEnabled) {
            var cbafEnabledValues = (
                Object.keys(enabledValues).reduce((acc, key) => {
                    var prefix = `/${studyId}/${start}_${end}/conditions/`;
                    if (key.startsWith(prefix)) {
                        var pointer = key.replace(prefix, '');
                        return ({
                            ...acc,
                            [pointer]: enabledValues[key]
                        })
                    }
                    else {
                        return acc;
                    }
                }, {})
            )

            if (Object.keys(cbafEnabledValues).length > 0) {
                for (var fieldKey of Object.keys(cbafEnabledValues)) {
                    var values = cbafEnabledValues[fieldKey];
                    for (var condition of cbaf.conditions) {
                        if (condition.fieldKey === fieldKey) {
                            condition.values = values;
                        }
                    }
                }

                filteredConditionsByAgeFrame.push(cbaf)
            }

            //console.log(cbafEnabledValues);
            //console.log(cbaf);
        }
    }
    
    return filteredConditionsByAgeFrame;
}

module.exports = filterAgeFrameConditions;
