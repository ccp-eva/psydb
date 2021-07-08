'use strict'
var datefns = require('date-fns');
var jsonpointer = require('jsonpointer');

var prepareSubjectTypeSettings = require('./prepare-subject-type-settings');
var filterAgeFrameConditions = require('./filter-age-frame-conditions');
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

            var filteredConditionsByAgeFrame = filterAgeFrameConditions({
                studyId: study._id,
                enabledAgeFrames,
                enabledValues,
                conditionsByAgeFrameList: (
                    subjectTypeSettings.conditionsByAgeFrame
                )
            })

            subjectTypeSettings.conditionsByAgeFrame = (
                filteredConditionsByAgeFrame
            );
        }

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
