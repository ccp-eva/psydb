'use strict';
var IdentifierString = require('./identifier-string');

var CustomRecordTypeFieldKey = ({ collection, recordType, ...other }) => {
    return ({
        ...IdentifierString(other),
        systemType: 'CustomRecordTypeFieldKey',
        systemProps: {
            collection,
            recordType, // only statics no $data
        }
    })
}

module.exports = CustomRecordTypeFieldKey;
