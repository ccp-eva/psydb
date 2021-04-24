'use strict';
var FieldConditionListItemOption = (
    require('./field-condition-list-item-option')
);

var FieldConditionListItem = ({
    collection,
    recordType,
    fields,
}) => ({
    systemType: 'FieldConditionListItem',
    type: 'object',
    lazyResolveProp: 'fieldKey',
    oneOf: fields.map(it => (
        FieldConditionListItemOption({
            collection,
            recordType,
            fieldKey: it.key,
            fieldType: it.type,
            fieldProps: it.props,
        })
    ))
})

module.exports = FieldConditionListItem;
