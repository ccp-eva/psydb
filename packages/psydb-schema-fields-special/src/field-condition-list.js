'use strict';
var FieldConditionListItem = require('./field-condition-list-item');

var FieldConditionList = ({
    collection,
    recordType,
    fields,

    enableCanChangePerSearch,
}) => ({
    systemType: 'FieldConditionList',
    type: 'array',
    default: [],
    items: FieldConditionListItem({
        collection,
        recordType,
        fields,

        enableCanChangePerSearch,
    })    
});

module.exports = FieldConditionList;
