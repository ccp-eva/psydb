'use strict';
var DefaultArray = require('./default-array'),
    ForeignId = require('./foreign-id');

var ForeignIdList = ({
    collection,
    recordType,
    constraints,

    minItems,
    ...additionalKeywords
}) => (
    DefaultArray({
        systemType: 'ForeignIdList',
        minItems: (minItems || 0),
        items: ForeignId({
            collection,
            recordType,
            constraints
        }),
        ...additionalKeywords,
    })
)

module.exports = ForeignIdList;
