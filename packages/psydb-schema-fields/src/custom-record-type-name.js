'use strict';
var IndentifierString = require('./identifier-string');

var CustomRecordTypeName = ({collection, ...other }) => {
    return ({
        ...IdentifierString(other),
        systemType: 'CustomRecordTypeName',
        systemProps: {
            collecton,
        }
    })
}

module.exports = CustomRecordTypeName;
