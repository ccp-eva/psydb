'use strict';
var {
    ExactObject,
    CustomRecordTypeName,
} = require('@mpieva/psydb-schema-fields');

var {
    AgeFrameSettingsList
} = require('@mpieva/psydb-schema-fields-special');

var ExternalLocationGrouping = require('./external-location-grouping');

var SubjectSelectionSettingsListItem = ({
    subjectRecordTypeRecords
}) => ({
    systemType: 'SubjectSelectionSettingsListItem',
    type: 'object',
    lazyResolveProp: 'subjectRecordType',
    oneOf: subjectRecordTypeRecords.map(it => (
        SubjectSelectionSettingsListItemOption({
            subjectRecordTypeRecord: it
        })
    ))
});

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

module.exports = SubjectSelectionSettingsListItem;
