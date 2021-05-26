'use strict';
var omit = require('@cdxoo/omit');
var allFieldSchemas = require('@mpieva/psydb-schema-fields');

var {
    ExactObject,
    CustomRecordTypeFieldKey,
} = allFieldSchemas;


var FieldConditionListItemOption = ({
    collection,
    recordType,
    fieldKey,
    fieldType,
    fieldProps,
    title,

    // FIXME: all the other instances of additionalProps in schema creators
    // should be renamed to "additionalKeywords",
    // FIXME: we could use additionalFieldProps
    enableCanChangePerSearch,
}) => {
    var FieldSchema = allFieldSchemas[fieldType];
    var valueItemsSchema = FieldSchema({
        ...omit('constraints', fieldProps),
    });

    // we dont whant lists here we want the individual
    // items of those lists
    if (valueItemsSchema.type === 'array') {
        valueItemsSchema = valueItemsSchema.items;
    }

    return (
        ExactObject({
            systemType: 'FieldConditionListItemOption',
            title,
            properties: {
                fieldKey: CustomRecordTypeFieldKey({
                    collection: collection,
                    recordType: recordType,
                    const: fieldKey,
                    default: fieldKey,
                }),
                values: {
                    type: 'array',
                    default: [],
                    title: 'Werte',
                    items: valueItemsSchema,
                },
                ...(enableCanChangePerSearch && { canChangePerSearch: {
                    type: 'boolean',
                    default: false,
                }}),
            },
            required: [
                'fieldKey',
                'values',
                'canChangePerSearch',
            ]
        })
    );
}

module.exports = FieldConditionListItemOption;
