'use strict';
var {
    ExactObject,
    CustomRecordTypeName,
} = require('@mpieva/psydb-schema-fields');

var {
    AgeFrameSettingsList
} = require('@mpieva/psydb-schema-fields-special');

var SubjectTypeSettingsItem = ({
    subjectRecordTypeRecords
}) => ({
    type: 'object',
    lazyResolveProp: 'subjectRecordType',
    oneOf: subjectRecordTypeRecords.map(it => (
        SubjectTypeSettingsItemOption({
            subjectRecordTypeRecord: it
        })
    ))
});

var SubjectTypeSettingsItemOption = ({
    subjectRecordTypeRecord
}) => {
    var {
        type,
        state: { settings: { subChannelFields: { scientific }}}
    } = subjectRecordTypeRecord;

    return (
        ExactObject({
            systemType: 'SubjectSelectionSettingsListItem',
            properties: {
                subjectRecordType: CustomRecordTypeName({
                    collection: 'subject',
                    const: type,
                    default: type,
                }),
                ageFrameSettingsList: AgeFrameSettingsList({
                    subjectRecordType: type,
                    subjectRecordTypeScientificFields: scientific,
                }),
            },
            required: [
                'subjectRecordType',
                'ageFrameSettings',
            ],
        })
    );
};

module.exports = SubjectTypeSettingsItem;
