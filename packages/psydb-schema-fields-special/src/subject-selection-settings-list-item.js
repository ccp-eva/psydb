'use strict';
var {
    ExactObject,
    CustomRecordTypeName,
} = require('@mpieva/psydb-schema-fields');

var SubjectSelectionSettingsListItemOption = require('./subject-selection-settings-list-item-option');

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

module.exports = SubjectSelectionSettingsListItem;
