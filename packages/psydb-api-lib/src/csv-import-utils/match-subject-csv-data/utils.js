'use strict';

var hasRecordValues = (systemType) => ([
    'ForeignId', 'ForeignIdList'
].includes(systemType))

var hasHSIValues = (systemType) => ([
    'HelperSetItemId', 'HelperSetItemIdList'
].includes(systemType))

var hasRefValues = (systemType) => (
    hasRecordValues(systemType) || hasHSIValues(systemType)
)

module.exports = {
    hasRecordValues,
    hasHSIValues,
    hasRefValues,
}
