'use strict';
var Id = require('./id');

// TODO: separate schema for edge constraints?
var ForeignId = ({ collection, recordType, constraints }) => {
    if (!collection) {
        throw new Error('missing collection parameter on foreign key creation');
    }
    return ({
        ...Id(),
        systemType: 'ForeignId',
        systemProps: {
            collection,
            recordType: recordType,
            constraints: constraints || {},
        }
    });
}

module.exports = ForeignId;
