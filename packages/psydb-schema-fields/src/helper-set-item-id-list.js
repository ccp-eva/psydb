'use strict';
var DefaultArray = require('./default-array'),
    HelperSetItemId = require('./helper-set-item-id');

var HelperSetItemIdList = ({
    set,
    minItems, 
    ...additionalKeywords
}) => (
    DefaultArray({
        systemType: 'HelperSetItemIdList',
        minItems: (minItems || 0),
        items: HelperSetItemId({ set }),
        ...additionalKeywords,
    })
)

module.exports = HelperSetItemIdList;
