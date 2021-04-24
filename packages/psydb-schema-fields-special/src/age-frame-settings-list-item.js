'use strict';
var {
    ExactObject,
    DaysSinceBirthInterval,
} = require('@mpieva/psydb-schema-fields');

var FieldConditionList = require('./field-condition-list');

var AgeFrameSettingsListItem = ({
    subjectRecordType,
    subjectRecordTypeScientificFields,
}) => (
    ExactObject({
        systemType: 'AgeFrameSettingsItem',
        properties: {
            ageFrame: DaysSinceBirthInterval(),
            conditionList: FieldConditionList({
                collection: 'subject',
                recordType: subjectRecordType,
                fields: subjectRecordTypeScientificFields,
            })
        },
        required: [
            'ageFrame',
            'conditionList',
        ]
    })
);


module.exports = AgeFrameSettingsListItem;
