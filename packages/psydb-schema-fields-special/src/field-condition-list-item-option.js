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

    // FIXME: all the other instances of additionalProps in schema creators
    // should be renamed to "additionalKeywords",
    // FIXME: we could use additionalFieldProps
    enableCanChangePerSearch,
}) => {
    var FieldSchema = allFieldSchemas[fieldType];
    return (
        ExactObject({
            systemType: 'FieldConditionListItemOption',
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
                    items: FieldSchema({
                        ...omit('constraints', fieldProps),
                    })
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
