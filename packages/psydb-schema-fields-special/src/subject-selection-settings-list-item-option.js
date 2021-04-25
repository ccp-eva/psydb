'use strict';
var {
    ExactObject,
    CustomRecordTypeName,
} = require('@mpieva/psydb-schema-fields');

var AgeFrameSettingsList = require('./age-frame-settings-list');
var ExternalLocationGrouping = require('./external-location-grouping');

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
                subjectRecordType: CustomRecordTypeName({
                    collection: 'subject',
                    const: type,
                    default: type,
                }),
                conditionsByAgeFrame: AgeFrameSettingsList({
                    subjectRecordType: type,
                    subjectRecordTypeScientificFields: scientific,
                }),
                generalConditions: {
                    // TODO: flash this out
                    type: 'array',
                    default: [],
                },
                externalLocationGrouping: ExternalLocationGrouping({
                    subjectRecordType: type,
                    subjectRecordTypeScientificFields: scientific,
                })
            },
            required: [
                'subjectRecordType',
                'conditionsByAgeFrame',
                'generalConditions',
                'externalLocationGrouping',
            ],
        })
    );
};

module.exports = SubjectSelectionSettingsListItemOption;
