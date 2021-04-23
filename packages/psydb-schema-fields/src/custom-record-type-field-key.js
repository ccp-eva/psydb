'use strict';
var IdentifierString = require('./identifier-string');

var CustomRecordTypeFieldKey = ({ collection, type, ...other }) => {
    return ({
        ...IdentifierString(other),
        systemType: 'CustomRecordTypeFieldKey',
        systemProps: {
            collection,
            type, // TODO: we need to handle { $data: '/foo' } for this
        }
    })
}

module.exports = CustomRecordTypeFieldKey;
