'use strict';
var {
    ExactObject,
    CustomRecordTypeName,
} = require('@mpieva/psydb-schema-fields');

var AgeFrameSettingsItem = require('./age-frame-settings-item');

var SubjectSelectionSettingsItem = () => ExactObject({
    systemType: 'SubjectSelectionSettingsItem',
    properties: {
        subjectRecordType: CustomRecordTypeName({ collection: 'subject' }),
        ageFrameSettings: {
            systemType: 'AgeFrameSettings',
            type: 'array',
            default: [],
            items: AgeFrameSettingsItem({
                // TODO: oh gawd ... well do this manually for now
                // EDIT: we could be using oneOf maybe and pass in
                // customRecordTypes data of all subject types
                subjectRecordTypeDataPointer: '2/subjectRecordType'
            })
        }
    },
    required: [
        'subjectRecordType',
        'ageFrameSettings',
    ],
})

module.exports = SubjectSelectionSettingsItem;
