'use strict'
var datefns = require('date-fns');
var jsonpointer = require('jsonpointer');
var { groupBy } = require('@mpieva/psydb-common-lib');

var prepareSubjectTypeSettings = require('./prepare-subject-type-settings');
var filterAgeFrameConditions = require('./filter-age-frame-conditions');
var makeCondition = require('./make-condition');

var AddSubjectTestabilityFieldsStage = ({
    experimentVariant,
    interval,
    ageFrameFilters,
    ageFrameValueFilters,

    subjectTypeKey,
    subjectTypeRecord,
    studyRecords,
}) => {

    /*var subjectTypeSettingsByStudy = prepareSubjectTypeSettings({
        studyRecords,
        subjectType: subjectTypeKey,
    });*/

    var customFields = (
        subjectTypeRecord.state.settings.subChannelFields.scientific
    );
    
    var ageFrameField = customFields.find(field => (
        field.props.isSpecialAgeFrameField === true
    ));

    var ageFrameFiltersByStudy = groupBy({
        items: ageFrameFilters,
        byProp: 'studyId',
    });

    var ageFrameValueFiltersByStudy = groupBy({
        items: ageFrameValueFilters,
        byProp: 'studyId',
    });

    var conditionsByStudy = {};
    for (var study of studyRecords) {
        var { _id } = study;
        var studyAgeFrameFilters = ageFrameFiltersByStudy[_id];
        var studyAgeFrameValueFilters = ageFrameValueFiltersByStudy[_id];

        /*var subjectTypeSettings = subjectTypeSettingsByStudy[study._id];

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
        }*/

        conditionsByStudy[`_testableIn_${study._id}`] = makeCondition({
            experimentVariant,
            searchInterval: interval,
            ageFrameFilters: studyAgeFrameFilters,
            ageFrameValueFilters: studyAgeFrameValueFilters,
            ageFrameTargetDefinition: ageFrameField,

            subjectTypeRecord,
            studyRecord: study,
        });
    }

    var stage = { $addFields: {
        ...(ageFrameField && {
            _ageFrameField: `$scientific.state.custom.${ageFrameField.key}`,
        }),
        ...conditionsByStudy
    }};

    //console.dir({ stage }, { depth: null });
    
    return stage;
}



module.exports = AddSubjectTestabilityFieldsStage;
