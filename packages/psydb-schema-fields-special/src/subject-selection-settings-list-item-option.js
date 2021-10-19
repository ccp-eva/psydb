'use strict';
var {
    ExactObject,
    DefaultBool,
    CustomRecordTypeKey,
    Integer,
} = require('@mpieva/psydb-schema-fields');

var AgeFrameSettingsList = require('./age-frame-settings-list');

var SubjectSelectionSettingsListItemOption = ({
    subjectRecordTypeRecord
}) => {
    var {
        type,
        state: { settings: { subChannelFields: { scientific }}}
    } = subjectRecordTypeRecord;

    return (
        ExactObject({
            systemType: 'SubjectSelectionSettingsListItemOption',
            properties: {
                enableOnlineTesting: DefaultBool(),
                subjectsPerExperiment: Integer({
                    title: 'Probanden pro Experiment',
                    default: 1,
                    minimum: 1,
                }),
                subjectRecordType: CustomRecordTypeKey({
                    collection: 'subject',
                    const: type,
                    default: type,
                }),
                generalConditions: {
                    // TODO: flash this out
                    type: 'array',
                    default: [],
                },
                conditionsByAgeFrame: AgeFrameSettingsList({
                    subjectRecordType: type,
                    subjectRecordTypeScientificFields: scientific,
                }),
            },
            required: [
                'enableOnlineTesting',
                'subjectsPerExperiment',
                'subjectRecordType',
                'conditionsByAgeFrame',
                'generalConditions',
                'externalLocationGrouping',
            ],
        })
    );
};

module.exports = SubjectSelectionSettingsListItemOption;
