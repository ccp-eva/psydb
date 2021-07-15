'use strict';
var inline = require('@cdxoo/inline-text');
var Id = require('./id');

var ForeignId = ({
    collection,
    recordType,
    constraints,
    systemProps,
    ...additionalKeywords
}) => {
    if (!collection) {
        throw new Error('missing collection parameter on foreign key creation');
    }
    return Id({
        systemType: 'ForeignId',
        systemProps: {
            collection,
            recordType: recordType,
            constraints: constraints || {},
            ...systemProps
        },
        ...additionalKeywords
    });
}

module.exports = ForeignId;
