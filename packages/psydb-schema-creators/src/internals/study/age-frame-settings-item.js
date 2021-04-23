'use strict';

var {
    ExactObject,
    CustomRecordTypeFieldKey,
    DaysSinceBirthInterval,
} = require('@mpieva/psydb-schema-fields');

var AgeFrameSettingsItem = ({
    //subjectRecordTypeDataPointer, // required for generic solutiona
    // TODO: pass subjectRecord Type data and use oneOf
    subjectRecordTypeName,
    subjectRecordTypeFieldData,
}) => ExactObject({
    properties: {
        ageFrame: DaysSinceBirthInterval(),
        conditionList: {
            type: 'array',
            default: [],
            items: ExactObject({
                properties: {
                    // TODO: we need oneOf here as well
                    // iterate over subjectRecordTypeFieldData
                    field: CustomRecordTypeFieldKey({
                        collection: 'subject',
                        type: subjectRecordTypeName, // TODO
                    }),
                    values: {
                        type: 'array',
                        default: [],
                        // TODO: format of values is the one
                        // of the referenced field
                    }
                }
            })
        }
    },
    required: [
        'ageFrame',
        'conditionList',
    ]
})

module.exports = AgeFrameSettingsItem;
