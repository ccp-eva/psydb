'use strict';
var {
    ExactObject,
    CustomRecordTypeName,
} = require('@mpieva/psydb-schema-fields');

var {
    AgeFrameSettingsList
} = require('@mpieva/psydb-schema-fields-special');


var ExternalLocationGrouping = ({
    subjectRecordType,
    subjectRecordTypeScientificFields,
}) => {
    var locationFieldKeys = [],
        locationFieldDisplayNames = [];
    for (var field of subjectRecordTypeScientificFields) {
        if (
            field.type === 'ForeignId'
            && field.props.collection === 'location'
        ) {
            locationFieldKeys.push(field.key);
            locationFieldDisplayNames.push(field.displayName);
        }
    }

    return ({
        type: 'object',
        lazyResolveProp: 'enabled',
        oneOf: [

            ExactObject({
                properties: {
                    enabled: {
                        type: 'boolean',
                        const: false,
                        default: false,
                    }
                },
                required: [
                    'enabled',
                ]
            }),
            
            ExactObject({
                properties: {
                    enabled: {
                        type: 'boolean',
                        const: true,
                        default: true,
                    },
                    fieldKey: {
                        type: 'string',
                        enum: locationFieldKeys,
                        // FIXME: enumNames is rjsf not sure if we
                        // want that here
                        enumNames: locationFieldDisplayNames,
                    }
                },
                required: [
                    'enabled',
                ]
            }),
            
        ]
    });
}

var SubjectSelectConditionsListItem = ({
    subjectRecordTypeRecords
}) => ({
    systemType: 'SubjectSelectConditionsListItem',
    type: 'object',
    lazyResolveProp: 'subjectRecordType',
    oneOf: subjectRecordTypeRecords.map(it => (
        SubjectSelectConditionsListItemOption({
            subjectRecordTypeRecord: it
        })
    ))
});

var SubjectSelectConditionsListItemOption = ({
    subjectRecordTypeRecord
}) => {
    var {
        type,
        state: { settings: { subChannelFields: { scientific }}}
    } = subjectRecordTypeRecord;

    return (
        ExactObject({
            systemType: 'SubjectSelectConditionsListItemOption',
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

module.exports = SubjectSelectConditionsListItem;
