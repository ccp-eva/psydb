'use strict';

var isRecordRef = (that) => (
    isType(that, [ 'ForeignId',  'ForeignIdList' ])
)
var isHSIRef = (that) => (
    isType(that, [ 'HelperSetItemId', 'HelperSetItemIdList' ])
)
var isRefList = (that) => (
    isType(that, [ 'ForeignIdList', 'HelperSetItemIdList' ])
)

var isType = (schemaOrSystemType, expected) => {
    var systemType = schemaOrSystemType?.systemType || schemaOrSystemType;

    if (Array.isArray(expected)) {
        return expected.includes(systemType)
    }
    else {
        return expected === systemType
    }
}

module.exports = {
    isSystemType: isType,

    isRecordRef,
    isHSIRef,
    isRefList,
}
