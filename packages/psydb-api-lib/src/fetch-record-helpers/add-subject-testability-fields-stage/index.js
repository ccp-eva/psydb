'use strict'
var datefns = require('date-fns');
var jsonpointer = require('jsonpointer');

var prepareSubjectTypeSettings = require('./prepare-subject-type-settings');
var makeCondition = require('./make-condition');

var AddSubjectTestabilityFieldsStage = ({
    experimentVariant,

    timeFrameStart,
    timeFrameEnd,

    enabledAgeFrames,
    enabledValues,
    
    subjectRecordTypeRecord,
    studyRecords,
}) => {

    var subjectTypeSettingsByStudy = prepareSubjectTypeSettings({
        studyRecords,
        subjectType: subjectRecordTypeRecord.type,
    });

    var customFields = (
        subjectRecordTypeRecord.state.settings.subChannelFields.scientific
    );
    
    var ageFrameField = customFields.find(field => (
        field.props.isSpecialAgeFrameField === true
    ))

    var conditionsByStudy = {};
    for (var study of studyRecords) {
        var subjectTypeSettings = subjectTypeSettingsByStudy[study._id];
        
        if (ageFrameField) {
            var enabledStudyAgeFrames = (
                enabledAgeFrames
                .filter(it => it.startsWith(`/${study._id}/`))
                .map(it => it.replace(`/${study._id}/`, ''))
            );

            var filteredConditionsByAgeFrame = [];
            for (var cbaf of subjectTypeSettings.conditionsByAgeFrame) {
                var { start, end } = cbaf.ageFrame;
                var cbafEnabled = (
                    enabledStudyAgeFrames.includes(`${start}_${end}`)
                )
                if (cbafEnabled) {
                    var cbafEnabledValues = (
                        Object.keys(enabledValues).reduce((acc, key) => {
                            var prefix = `/${study._id}/${start}_${end}/conditions/`;
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

            subjectTypeSettings.conditionsByAgeFrame = (
                filteredConditionsByAgeFrame
            );

            /*subjectTypeSettings.conditionsByAgeFrame = (
                subjectTypeSettings.conditionsByAgeFrame.filter(it => {
                    var { start, end } = it.ageFrame;
                    return enabledStudyAgeFrames.includes(`${start}_${end}`)
                })
            )*/

            //console.dir(subjectTypeSettings, { depth: null });
        }

        //throw new Error();

        conditionsByStudy[`_testableIn_${study._id}`] = makeCondition({
            experimentVariant,
            ageFrameFieldKey: ageFrameField && ageFrameField.key,
            timeFrameStart,
            timeFrameEnd,
            subjectRecordTypeRecord,
            subjectTypeSettings: subjectTypeSettingsByStudy[study._id],
            studyRecord: study,
        });
    }

    return ({ $addFields: {
        ...(ageFrameField && {
            _ageFrameField: `$scientific.state.custom.${ageFrameField.key}`,
        }),
        ...conditionsByStudy
    }});
}



module.exports = AddSubjectTestabilityFieldsStage;
