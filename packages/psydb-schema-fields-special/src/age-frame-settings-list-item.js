'use strict';
var {
    ExactObject,
    DaysSinceBirthInterval,
} = require('@mpieva/psydb-schema-fields');

var FieldConditionList = require('./field-condition-list');

var AgeFrameSettingsListItem = ({
    subjectRecordType,
    subjectRecordTypeScientificFields,

    enableCanChangePerSearch = true,
}) => (
    ExactObject({
        systemType: 'AgeFrameSettingsItem',
        properties: {
            ageFrame: DaysSinceBirthInterval(),
            conditions: FieldConditionList({
                collection: 'subject',
                recordType: subjectRecordType,
                fields: subjectRecordTypeScientificFields,

                enableCanChangePerSearch,
            })
        },
        required: [
            'ageFrame',
            'conditions',
        ]
    })
);


module.exports = AgeFrameSettingsListItem;
