'use strict';
var FieldConditionListItemOption = (
    require('./field-condition-list-item-option')
);

var FieldConditionListItem = ({
    collection,
    recordType,
    fields,

    enableCanChangePerSearch,
}) => ({
    systemType: 'FieldConditionListItem',
    type: 'object',
    lazyResolveProp: 'fieldKey',
    title: 'Zeilfeld',
    oneOf: fields.map(it => (
        FieldConditionListItemOption({
            collection,
            recordType,
            fieldKey: it.key,
            fieldType: it.type,
            fieldProps: it.props,
            title: it.displayName,

            enableCanChangePerSearch,
        })
    ))
})

module.exports = FieldConditionListItem;
