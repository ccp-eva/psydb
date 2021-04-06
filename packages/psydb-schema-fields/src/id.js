'use strict';
var Id = ({
    additionalKeywords,
    ...other
} = {}) => ({
    systemType: 'Id',
    type: 'string',
    format: 'nanoid-default',
    //format: 'mongodb-object-id',
    //unmarshalMongodbObjectId: true,
    ...additionalKeywords,
});

module.exports = Id;
