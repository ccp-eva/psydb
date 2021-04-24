'use strict';
var FieldConditionListItem = require('./field-condition-list-item');

var FieldConditionList = ({
    collection,
    recordType,
    fields,
}) => ({
    systemType: 'FieldConditionList',
    type: 'array',
    default: [],
    items: FieldConditionListItem({
        collection,
        recordType,
        fields
    })    
});

module.exports = FieldConditionList;
