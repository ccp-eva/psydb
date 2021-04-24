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
                        ...omit('systemProps', fieldProps),
                    })
                },
                canChangePerSearch: {
                    type: 'boolean',
                    default: false,
                },
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
