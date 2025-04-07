'use strict';
var IdentifierString = require('./identifier-string');

var CustomRecordTypeKey = (keywords) => {
    var {
        collection,
        enableResearchGroupFilter = true,
        ...extraKeywords
    } = keywords;

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
