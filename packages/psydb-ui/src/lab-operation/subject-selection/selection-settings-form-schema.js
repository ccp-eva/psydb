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

import * as stringifiers from '@mpieva/psydb-ui-lib/src/field-stringifiers';

const SelectionSettingsFormSchema = ({
    timeFrameDefaults,
    studySelectionSettings,

    customFieldDefinitions,
    relatedRecords,
    relatedHelperSetItems,
}) => BasicObject({
    timeFrame: DateOnlyInterval({
        title: 'Zeitfenster für Termin',
        additionalStartKeywords: {
            title: 'Beginn',
            default: timeFrameDefaults.start,
        },
        additionalEndKeywords: {
            title: 'Ende',
            default: timeFrameDefaults.end,
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
                relatedHelperSetItems,
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
        { title: 'Suchbedingungen', systemType: 'SearchSelectionSettings' }
    )
})

const StudySettings = ({
    prefix,
    studyName,
    studyShorthand,
    selectionSettingsBySubjectType: {
        generalConditions,
        conditionsByAgeFrame,
    },

    customFieldDefinitions,
    relatedRecords,
    relatedHelperSetItems,
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
                    relatedHelperSetItems,
                })
            }
        }, {})
    )
}, { title: studyShorthand, systemType: 'SearchStudySettings' });

const AgeFrameSettings = ({
    prefix,
    ageFrame,
    conditions,

    customFieldDefinitions,
    relatedRecords,
    relatedHelperSetItems,
}) => {
    var stringifiedAgeFrame = stringifiers.AgeFrame(ageFrame);
    var title = `Altersfenster: ${stringifiedAgeFrame} (J/M/T)`;
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
                                relatedHelperSetItems,
                            })
                        }
                        : acc
                    )
                }, {}),
                { systemType: 'SearchConditionList'}
            )
        }, { systemType: 'SearchAgeFrame'})
    )
}

const ConditionValues = ({
    prefix,
    fieldKey,
    values,

    customFieldDefinitions,
    relatedRecords,
    relatedHelperSetItems,
}) => BasicObject(
    values.reduce((acc, value, index) => ({
        ...acc,
        //NOTE: value could be a number
        [`value_${index}`]: BoolTrue({
            title: stringifyFieldValue({
                fieldKey,
                value,
                customFieldDefinitions,
                relatedRecords,
                relatedHelperSetItems,
            }),
        })
    }), {}),
    { 
        title: stringifyFieldKey({
            fieldKey,
            customFieldDefinitions
        }),
        systemType: 'SearchConditionValues'
    }
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
}) => {
    var definition = customFieldDefinitions.find(it => it.key === fieldKey);
    return definition.displayName
};

var stringifyFieldValue = ({
    fieldKey,
    value,
    customFieldDefinitions,
    relatedRecords,
    relatedHelperSetItems,
}) => {
    var definition = customFieldDefinitions.find(it => it.key === fieldKey);
    switch (definition.type) {
        case 'ForeignId':
        case 'ForeignIdList':
            var collection = definition.props.collection;
            var record = relatedRecords[collection][value];
            return record._recordLabel;
        
        case 'HelperSetItemId':
        case 'HelperSetItemIdList':
            var set = definition.props.set;
            var helperSetItem = relatedHelperSetItems[set][value];
            return helperSetItem.state.label;

        default: 
            var stringify = stringifiers[definition.type];
            var str = (
                stringify
                ? stringify(value)
                : String(value)
            )
            return str;
    }
}

export default SelectionSettingsFormSchema;
