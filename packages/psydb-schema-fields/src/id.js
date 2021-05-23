'use strict';
var Id = ({
    ...additionalKeywords
} = {}) => ({
    systemType: 'Id',
    type: 'string',
    format: 'nanoid-default',
    //format: 'mongodb-object-id',
    //unmarshalMongodbObjectId: true,
    ...additionalKeywords,
});

module.exports = Id;
