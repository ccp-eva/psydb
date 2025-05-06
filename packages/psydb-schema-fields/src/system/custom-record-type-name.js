'use strict';
var IdentifierString = require('./identifier-string');

var CustomRecordTypeName = ({ collection, ...other }) => {
    return ({
        ...IdentifierString(other),
        systemType: 'CustomRecordTypeName',
        systemProps: {
            collection,
        }
    })
}

module.exports = CustomRecordTypeName;
