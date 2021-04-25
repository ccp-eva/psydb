import {
    BasicObject,
    BasicArray,
    BasicBool,
    DateOnlyInterval,
} from '@mpieva/psydb-schema-fields';

const BoolTrue = ({ ...additionalKeywords } = {}) => BasicBool({
    default: true,
    ...additionalKeywords
});

const SelectionSettingsFormSchema = ({
    timeFrameDefaults,
    studySelectionSettings,

    customFieldDefinitions,
    relatedRecords,
}) => BasicObject({
    timeFrame: DateOnlyInterval({
        title: 'Zeitfenster für Termin',
        additionalStartKeywords: {
            title: 'Beginn',
            default: timeFrameDefaults.start,
        },
        additionalEndKeywords: {
            title: 'Ende',
            default: timeFrameDefaults.start,
        },
    }),
    selectionSettings: BasicObject(
        studySelectionSettings.reduce((acc, item) => ({
            ...acc,
            [item.studyId]: StudySettings({
                ...item,
                prefix: item.studyId,

                customFieldDefinitions,
                relatedRecords,
            })
        }), {}),
        /*id_1: BasicObject({
            ageFrames: BasicObject({
                'ageframe_1': BasicObject({
                    active: Bool({
                        title: 'Aktiv',
                    }),
                    conditions: BasicObject({
                        'field_values_1': BasicObject({
                            'german': Bool({})
                        }, { title: 'Schulfächer' })
                    })
                }, { title: 'Altersfenster: 1/0/0 - 2/0/0 (J/M/T)' })
            })
         },{ title: 'tolle studie '}) */
        { title: 'Suchbedingungen' }
    )
})

const StudySettings = ({
    prefix,
    studyName,
    selectionSettingsBySubjectType: {
        generalConditions,
        conditionsByAgeFrame,
    },

    customFieldDefinitions,
    relatedRecords,
}) => BasicObject({
    conditionsByAgeFrame: BasicObject(
        conditionsByAgeFrame.reduce((acc, item) => {
            var {
                ageFrame,
                conditions
            } = item;

            var key = `${ageFrame.start}_${ageFrame.end}`;

            return {
                ...acc,
                [key]: AgeFrameSettings({
                    prefix: `${prefix}.${key}`,
                    ageFrame,
                    conditions,

                    customFieldDefinitions,
                    relatedRecords,
                })
            }
        }, {})
    )
}, { title: studyName });

const AgeFrameSettings = ({
    prefix,
    ageFrame,
    conditions,

    customFieldDefinitions,
    relatedRecords,
}) => {
    var title = `Altersfenster: ${ageFrame.start}_${ageFrame.end}`;
    return (
        BasicObject({
            enabled: BoolTrue({ title }),
            conditions: BasicObject(
                conditions.reduce((acc, item) => {
                    var { fieldKey, values, canChangePerSearch } = item;
                    canChangePerSearch = true; // TODO for testing purposes
                    return (
                        canChangePerSearch === true
                        ? {
                            ...acc,
                            [fieldKey]: ConditionValues({
                                prefix: `${prefix}.${fieldKey}`,
                                fieldKey,
                                values,

                                customFieldDefinitions,
                                relatedRecords,
                            })
                        }
                        : acc
                    )
                }, {})
            )
        })
    )
}

const ConditionValues = ({
    prefix,
    fieldKey,
    values,

    customFieldDefinitions,
    relatedRecords,
}) => BasicObject(
    values.reduce((acc, value, index) => ({
        [`${prefix}.${index}`]: BoolTrue({
            title: stringifyFieldValue({
                fieldKey,
                value,
                customFieldDefinitions,
                relatedRecords,
            }),
        })
    }), {}),
    { title: stringifyFieldKey({
        fieldKey,
        customFieldDefinitions
    }) }
)

// TODO: to this needs to hit agains related
// for foreigId, helperSetItem,
//
// so A we need the field types for stringification
// or we can  prestringify thos on api enda
// i propose to put with the customFieldTypes in the response
// keyed by the fieldKey
var stringifyFieldKey = ({
    fieldKey,
    customFieldDefinitions,
}) => (
    String(fieldKey)
);

var stringifyFieldValue = ({
    fieldKey,
    value,
    customFieldDefinitions,
    relatedRecords,
}) => (
    String(value)
)

export default SelectionSettingsFormSchema;
