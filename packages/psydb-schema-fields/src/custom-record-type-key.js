'use strict';
var IdentifierString = require('./identifier-string');

var CustomRecordTypeKey = ({ collection, ...additionalKeywords }) => {
    return ({
        ...IdentifierString(additionalKeywords),
        systemType: 'CustomRecordTypeKey',
        systemProps: {
            collection,
        },
    })
}

module.exports = CustomRecordTypeKey;
