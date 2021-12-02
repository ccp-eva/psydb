'use strict';
var DefaultArray = require('./default-array'),
    HelperSetItemId = require('./helper-set-item-id');

var HelperSetItemIdList = ({
    setId,
    minItems, 
    ...additionalKeywords
}) => (
    DefaultArray({
        systemType: 'HelperSetItemIdList',
        systemProps: { setId },
        minItems: (minItems || 0),
        items: HelperSetItemId({ setId }),
        ...additionalKeywords,
    })
)

module.exports = HelperSetItemIdList;
