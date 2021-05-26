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
    ...additionalKeywords
}) => (
    ExactObject({
        systemType: 'AgeFrameSettingsItem',
        properties: {
            ageFrame: DaysSinceBirthInterval({
                title: 'Altersfenster',
                startKeywords: { title: 'Beginn' },
                endKeywords: { title: 'Ende' },
            }),
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
        ],
        ...additionalKeywords
    })
);


module.exports = AgeFrameSettingsListItem;
