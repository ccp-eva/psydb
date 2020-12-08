'use strict';
var Id = ({
    additionalKeywords,
    ...other
} = {}) => ({
    type: 'string',
    format: 'mongodb-object-id',
    unmarshalMongodbObjectId: true,
    ...additionalKeywords,
});

module.exports = Id;
