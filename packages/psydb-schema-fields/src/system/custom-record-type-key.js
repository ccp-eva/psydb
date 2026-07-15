'use strict';
var IdentifierString = require('./identifier-string');

var CustomRecordTypeKey = (bag = {}) => {
    var {
        collection,
        enableResearchGroupFilter = true,
        ...extraKeywords
    } = bag;

    return ({
        ...IdentifierString(extraKeywords),
        systemType: 'CustomRecordTypeKey',
        systemProps: {
            collection,
            enableResearchGroupFilter,
        },
    })
}

module.exports = CustomRecordTypeKey;
